import { IAction } from './actions'

type TReducerMap<T> = {
	[action: string]: (action: IAction, state?: T) => T
}

export type TById<TItem> = {
	[id: number]: TItem | undefined
}

export type TByUid<TItem> = {
	[id: string]: TItem | undefined
}

export const toReducer = <T>(
	defaultState: T,
	reducerFactory: (state: T) => TReducerMap<T>
) => (
	state: T = defaultState,
	action: IAction
) => {

	const reducer = reducerFactory(state)[action.type]
	if (!reducer) {
		return state
	}

	return reducer(action, state)
}