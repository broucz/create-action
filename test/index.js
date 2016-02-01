/* global describe it afterEach */
/* eslint no-unused-expressions:0 */

import { expect } from 'chai';
import { isPlainObject } from 'lodash';
import defineActionCreator from '../src';

describe('Utils | defineActionCreator', () => {
  // Type reference.
  const type = 'TYPE';

  it('should return a plain object', () => {
    const actionCreator = defineActionCreator(type);
    const data = { key: 'value' };
    const action = actionCreator(data);
    expect(isPlainObject(action)).to.be.true;
  });

  it('should return the type as type', () => {
    const actionCreator = defineActionCreator(type);
    const data = { key: 'value' };
    const action = actionCreator(data);
    expect(action.type).to.deep.equal(type);
  });

  it('should return the arguments as payload', () => {
    const actionCreator = defineActionCreator(type);
    const data = { key: 'value' };
    const action = actionCreator(data);
    expect(action.payload).to.deep.equal(data);
  });

  it('should not have extraneous keys', () => {
    const actionCreator = defineActionCreator(type);
    const data = { key: 'value' };
    const action = actionCreator(data);
    expect(action).to.deep.equal({
      type,
      payload: data,
    });
  });

  it('should use the payloadCreator', () => {
    const actionCreator = defineActionCreator(type, n => n + 1);
    const data = 1;
    const action = actionCreator(data);
    expect(action.payload).to.equal(2);
  });

  it('should use the identity function if payloadCreator is not a function', () => {
    const actionCreator = defineActionCreator(type);
    const data = 1;
    const action = actionCreator(data);
    expect(action.payload).to.equal(1);
  });

  it('should set error to true if payload is an Error object', () => {
    const actionCreator = defineActionCreator(type);
    const errObj = new Error('Something bad...');
    const errAction = actionCreator(errObj);
    expect(errAction).to.deep.equal({
      type,
      payload: errObj,
      error: true,
    });
  });

  it('should use the metaCreator', () => {
    const actionCreator = defineActionCreator(type, n => n, ({ id }) => ({ id }));
    const data = { key: 'value', id: 'abc' };
    const action = actionCreator(data);
    expect(action).to.deep.equal({
      type,
      payload: data,
      meta: {
        id: 'abc',
      },
    });
  });

  it('should use ignore the metaCreator if is not a function', () => {
    const actionCreator = defineActionCreator(type, n => n, { id: 'test' });
    const data = { key: 'value', id: 'abc' };
    const action = actionCreator(data);
    expect(action).to.deep.equal({
      type,
      payload: data,
    });
  });
});
