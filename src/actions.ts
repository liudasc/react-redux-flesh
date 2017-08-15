export interface IAction {
	type: string
}

export interface ISetValueAction<T> extends IAction {
	value: T
}

export const setValueActionCreator = <T>(type: string) => (
	value: T
): ISetValueAction<T> => ({
	type,
	value
})