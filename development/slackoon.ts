'use strict';
/// <reference path="typings/tds.d.ts"/>
/** Requires */
import * as _ from 'lodash';
import * as request from 'request-promise';

interface JsonObject {
  [key: string]: (string | number | boolean | void | JsonObject[] | JsonObject);
}

interface SlackOpts {
  token?: string;
  requestDefaults?: any;
}

interface QueryOpts extends JsonObject {
  token?: string;
  user?: string;
  as_user?: boolean;
}

interface SlackRequest extends JsonObject {
  ok?: boolean;
  user?: string;
  team?: string;
  team_id?: string;
  user_id?: string;
  error?: string;
}

class Slackbot {
  private _rp;
  private _options: SlackOpts;

  private token: string;
  private user: string;
  private team: string;
  private team_id: string;
  private user_id: string;

  constructor(token: string);
  constructor(options: SlackOpts);
  constructor(options: any) {
    this._options = {
      token: undefined,
      requestDefaults: undefined
    };

    // Передан токен
    if (_.isString(options)) {
      this._options.token = options;
    } else {
      this._options = _.merge(this._options, options);
    }

    this.token = this._options.token;

    this._rp = request.defaults(_.assign({
      jar: true,     // Сохранять куки
      timeout: 5000, // Ждать ответа
      headers: {
        'User-Agent': "slackbot"
      },
      agentOptions: {
        keepAlive: true
      },
      gzip: true     // Сжимать ответ
    }, this._options.requestDefaults));
  }

  /**
   * Проверка кто пользователь по токену
   * @return {Promise}
   */
  async whoami(): Promise<SlackRequest> {
    const result: SlackRequest = await this._query('auth.test');

    if (result.ok) {
      /*eslint-disable camelcase */
      this.user = result.user;
      this.team = result.team;
      this.team_id = result.team_id;
      this.user_id = result.user_id;
      /*eslint-enable camelcase */
    } else {
      throw new Error(result.error);
    }
    return result;
  }

  /**
   * Умный запрос к API. Если бот на залогинен, тогда вызовет #whoami
   * @param  {String} method
   * @param  {Object} [opts]
   * 
   * @return {Promise}
   */
  async query(method: string, opts?: QueryOpts): Promise<SlackRequest> {
    // Если пользователь не авторизован, узнаем кто мы
    if (!opts.user && !this.user) {
      await this.whoami();
    }

    if (!opts.user) {
      /*eslint-disable camelcase */
      opts.user = this.user;
      opts.as_user = true;
      /*eslint-enable camelcase */
    }

    return this._query(method, opts);
  }

  /**
   * Запрос к API
   * @param  {String} method
   * @param  {Object} [opts]
   * 
   * @return {Promise}
   *
   * @private
   */
  private _query(method: string, opts?: QueryOpts): PromiseLike<SlackRequest> {
    opts = _.merge({
      token: this.token
    }, opts);

    return this._rp({
      uri: `https://slack.com/api/${method}`,
      qs: opts,
      json: true
    });
  }
}

module.exports = Slackbot;
