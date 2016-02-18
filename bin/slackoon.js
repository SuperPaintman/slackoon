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
const rp = request.defaults({
    jar: true,
    timeout: 5000,
    headers: {
        'User-Agent': "slackbot"
    },
    agentOptions: {
        keepAlive: true
    },
    gzip: true // Сжимать ответ
});
class Slackbot {
    constructor(token) {
        this.token = token;
    }
    /**
     * Проверка кто пользователь по токену
     * @return {Promise}
     */
    whoami() {
        return __awaiter(this, void 0, Promise, function* () {
            const result = yield this._query('auth.test');
            if (result.ok) {
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
    query(method, opts) {
        return __awaiter(this, void 0, Promise, function* () {
            // Если пользователь не авторизован, узнаем кто мы
            if (!opts.user && !this.user) {
                yield this.whoami();
            }
            if (!opts.user) {
                /*eslint-disable camelcase */
                opts.user = this.user;
                opts.as_user = true;
            }
            return this._query(method, opts);
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
    _query(method, opts) {
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
