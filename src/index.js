/**
 * Utility function that ensure `creator` to be a function.
 * If the `creator` is undefined or not a function, an Identity function
 * is applied.
 *
 * @type {any}
 * @return {Function}
 */
const selectCreator = creator =>
  (typeof creator === 'function')
    ? creator
    : value => value;

/**
 * Warp an action creator in order to ensure that the generated action
 * will be standard, and handle error cases.
 *
 * Example:
 *
 * 	// Basic.
 * 	const actionCreator = createAction('SEND_NUMBER');
 * 	expect(actionCreator(1)).to.deep.equal({
 * 		type: 'SEND_NUMBER',
 * 		payload: 1
 * 	});
 *
 * 	// Using payloadCreator.
 * 	const actionCreator = createAction('INCREMENT', n => n +1);
 * 	expect(actionCreator(1)).to.deep.equal({
 * 		type: 'INCREMENT',
 * 		payload: 2
 * 	});
 *
 * 	// Using metaCreator.
 * 	const actionCreator = createAction('LOG', n => n, ({ id }) => ({ id, v: '0.3.0' }));
 * 	expect(actionCreator({ id: '1', msg: 'connection' })).to.deep.equal({
 * 		type: 'LOG',
 * 		payload: { id: '1', msg: 'connection' },
 * 		meta: {
 * 			id: '1',
 * 			v: '0.3.0'
 * 		}
 * 	});
 *
 * @param  {string} type
 * @param  {Function} payloadCreator
 * @param  {Function} metaCreator
 * @return {Object}
 */
const createAction = (type, payloadCreator, metaCreator) =>
  (...args) => {
    // Action boilerplate.
    const action = {
      type,
      payload: selectCreator(payloadCreator)(...args),
    };

    // Handle errors if the payload is an Error object.
    if (args.length === 1 && args[0] instanceof Error) {
      action.error = true;
    }

    // Create a `meta` key if metaCreator is provided.
    if (typeof metaCreator === 'function') {
      action.meta = metaCreator(...args);
    }

    return action;
  };

export default createAction;
