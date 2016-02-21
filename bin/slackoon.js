'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
/// <reference path="typings/tds.d.ts"/>
/** Requires */
var _ = require('lodash');
var request = require('request-promise');
class Slackbot {
    constructor(options) {
        this._options = {
            token: undefined,
            requestDefaults: undefined
        };
        // Передан токен
        if (_.isString(options)) {
            this._options.token = options;
        }
        else {
            this._options = _.merge(this._options, options);
        }
        this.token = this._options.token;
        this._rp = request.defaults(_.assign({
            jar: true,
            timeout: 5000,
            headers: {
                'User-Agent': "slackbot"
            },
            agentOptions: {
                keepAlive: true
            },
            gzip: true // Сжимать ответ
        }, this._options.requestDefaults));
    }
    /**
     * Проверка кто пользователь по токену
     * @return {Promise}
     */
    whoami() {
        return __awaiter(this, void 0, Promise, function* () {
            const result = yield this._query('auth.test');
            if (result.ok && !result.error) {
                /*eslint-disable camelcase */
                this.user = result.user;
                this.team = result.team;
                this.team_id = result.team_id;
                this.user_id = result.user_id;
            }
            else {
                throw new Error(result.error);
            }
            return result;
        });
    }
    /**
     * Умный запрос к API. Если бот на залогинен, тогда вызовет #whoami
     * @param  {String} method
     * @param  {Object} [opts]
     *
     * @return {Promise}
     */
    query(method, options) {
        return __awaiter(this, void 0, Promise, function* () {
            // Если пользователь не авторизован, узнаем кто мы
            if (!options.user && !this.user) {
                yield this.whoami();
            }
            if (!options.user) {
                /*eslint-disable camelcase */
                options.user = this.user;
                options.as_user = true;
            }
            const result = yield this._query(method, options);
            if (result.ok && !result.error) {
                return result;
            }
            else {
                throw new Error(result.error);
            }
        });
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
    _query(method, options) {
        options = _.merge({
            token: this.token
        }, options);
        return this._rp({
            uri: `https://slack.com/api/${method}`,
            qs: options,
            json: true
        });
    }
}
module.exports = Slackbot;
