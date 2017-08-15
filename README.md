# redux-juice

Like explicitness of Redux? Hate boilerplate you need to write? That is exactly what inspired me to write companion library for Redux. Patters emerged after working for quite some time on React/Redux apps and I decided to share them.

Basic idea that if you treat your state as database there will be only few types of action and reducers you will ever need to accomplish anything. Why not generate actions/reducers and focus our attention on business logic instead?

# Actions

## setValueActionCreator

## addItemsActionCreator
## removeItemsActionCreator
## updateItemsActionCreator

# Reducers

## toReducers - get rid of switch statements and use function instead (this how you get proper scope in switch cases and need no worry about overshadowing variables from other case statements)

