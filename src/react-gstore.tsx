import React from "react"

const EMPTY: unique symbol = Symbol()

export interface ContainerProviderProps<State = void> {
	initialState?: State
	children: React.ReactNode
}

export interface Container<Value, State = void> {
	Provider: React.ComponentType<ContainerProviderProps<State>>
	useContainer: () => Value
}

export interface ProviderProps {
    containers: Array<{container: Container<any, any>, initialState? : any}>
    children?: React.ReactNode
}

const saveToLocalStorage = (func: Function, prefix?: string, name?: string) => {
    return (...args : any) => {
        let localStorageName : string = `${prefix ? prefix : ''}` + `${name ? name : func.name}`

        let str : string | null = null
        if(localStorageName) str = localStorage.getItem(localStorageName)
        let argsFromStorage = str ? JSON.parse(str) : null

        let result = func.apply(undefined, argsFromStorage ? [argsFromStorage] : args)

        if(localStorageName) {
            localStorage.setItem(localStorageName, JSON.stringify(result))
        }
        return result
    }
}

const saveToSessionStorage = (func: Function, prefix?: string, name?: string) => {
    return (...args : any) => {
        let sessionStorageName : string = `${prefix ? prefix : ''}` + `${name ? name : func.name}` 

        let str : string | null = null
        if(sessionStorageName) str = sessionStorage.getItem(sessionStorageName)
        let argsFromStorage = str ? JSON.parse(str) : null

        let result = func.apply(undefined, argsFromStorage ? [argsFromStorage] : args)

        if(sessionStorageName) {
            localStorage.setItem(sessionStorageName, JSON.stringify(result))
        }
        return result
    }
}

export function createContainer<Value, State = void>(
    useHook: (initialState?: State) => Value, 
    saveToStorage? : boolean, 
    saveConfig? : {type?: string, prefix?: string, name?: string}
    ): Container<Value, State> {
    
    if(saveToStorage) {
        let saveType = saveConfig?.type? saveConfig.type : 'local'
        let prefix = saveConfig?.prefix? saveConfig.prefix : undefined
        let name = saveConfig?.name? saveConfig.name : undefined
        if(saveType === 'local') useHook = saveToLocalStorage(useHook, prefix, name)
        if(saveType === 'session') useHook = saveToSessionStorage(useHook, prefix, name)
    }

	let Context = React.createContext<Value | typeof EMPTY>(EMPTY)

	function Provider(props: ContainerProviderProps<State>) {
		let value = useHook(props.initialState)
		return <Context.Provider value={value}>{props.children}</Context.Provider>
	}

	function useContainer(): Value {
		let value = React.useContext(Context)
		if (value === EMPTY) {
			throw new Error("Component must be wrapped with <Container.Provider>")
		}
		return value
	}

	return { Provider, useContainer }
}

export function Provider (props : ProviderProps) {
    const rec = (props: ProviderProps, index: number) : any => {
        if(props.containers.length <= index) {
            return props.children
        }
        let item : {container: Container<any, any>, initialState? : any} | undefined = props.containers[index]
        if(!item) {
            return rec(props, index + 1)
        }
        return (
            <item.container.Provider initialState={item.initialState}>
                {rec(props, index + 1)}
            </item.container.Provider>
        )
    }
    return rec(props, 0)
}

export function useContainer<Value, State = void>(
	container: Container<Value, State>,
): Value {
	return container.useContainer()
}