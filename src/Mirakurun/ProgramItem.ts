/*
   Copyright 2016 Yuki KAN

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
/// <reference path="../../typings/node/node.d.ts" />
'use strict';

import stream = require('stream');
import _ = require('./_');
import common = require('./common');
import db = require('./db');
import Event = require('./Event');
import Tuner = require('./Tuner');
import ChannelItem = require('./ChannelItem');
import Service = require('./Service');
import ServiceItem = require('./ServiceItem');

class ProgramItem {

    constructor(private _data: db.Program) {

        if (_.program.exists(_data.id) === true) {
            return this;
        }

        _.program.add(this);
        this._updated();
    }

    get id(): number {
        return this._data.id;
    }

    get service(): ServiceItem {
        return Service.get(this._data.serviceId);
    }

    get data(): db.Program {
        return this._data;
    }

    update(data: db.Program): void {

        if (data.id !== this._data.id) {
            if (_.program.exists(data.id) === true) {
                _.program.remove(this);
                return;
            }
        }

        this._data = data;

        _.program.save();
        this._updated();
    }

    getStream(user: common.User): Promise<stream.Readable> {
        return Tuner.getProgramStream(this, user);
    }

    private _updated(): void {
        Event.emit('program', this._data)
    }
}

export = ProgramItem;