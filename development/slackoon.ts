'use strict';
/// <reference path="typings/tds.d.ts"/>
/** Requires */
import * as _ from 'lodash';
import * as request from 'request-promise';

const rp = request.defaults({
  jar: true, // Сохранять куки
  timeout: 5000, // Ждать ответа
  headers: {
    'User-Agent': "slackbot"
  },
  agentOptions: {
    keepAlive: true
  },
  gzip: true // Сжимать ответ
});

interface QueryOpts {
  [key: string]: (string | number | boolean | any[] | {});
  token?: string;
  user?: string;
  as_user?: boolean;
}

interface SlackRequest {
  [key: string]: (string | number | boolean | any[] | {});
  ok?: boolean;
  user?: string;
  team?: string;
  team_id?: string;
  user_id?: string;
  error?: string;
}

class Slackbot {
  private token: string;
  private user: string;
  private team: string;
  private team_id: string;
  private user_id: string;

  constructor(token: string) {
    this.token = token;
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

    return rp({
      uri: `https://slack.com/api/${method}`,
      qs: opts,
      json: true
    });
  }
}

module.exports = Slackbot;
