# React global store (react-gstore)
This library is intended for creating a global store in react
## Install
```shell
npm i react-gstore
```
## Examples

### 1 store
```javascript
import React, { useState } from "react"
import { createContainer } from "react-gstore"
import { render } from "react-dom"
 
function useTheme(initialState = 0) {
    let [theme, setTheme] = useState(initialState)
    let dark = () => setTheme(1)
    let light = () => setTheme(0)
    let anotherTheme = () => setTheme((theme + 1) % 2)
    return { theme, dark, light, anotherTheme}
}
 
let Theme = createContainer(useTheme)
 
function MyBlock() {
    let theme = Theme.useContainer()
    return (
        <div style={{backgroundColor: theme.theme === 0 ? 'white' : '#333333'}}>
            <p>
                Hello world
            </p>
            <button onClick={theme.anotherTheme}>
                Change theme
            </button>
        </div>
    )
}
 
function App() {
    return (
        <Theme.Provider initialState={1}>
            <MyBlock />
        </Theme.Provider>
    )
}
 
render(<App />, document.getElementById("root"))
```
### 2 and more stores
```javascript
import React, { useState } from "react"
import { createContainer, Provider } from "react-gstore"
import { render } from "react-dom"
 
function useTheme(initialState = 0) {
    let [theme, setTheme] = useState(initialState)
    let dark = () => setTheme(1)
    let light = () => setTheme(0)
    let anotherTheme = () => setTheme((theme + 1) % 2)
    return { theme, dark, light, anotherTheme}
}
 
function useCounter(initialState = 0) {
    let [count, setCount] = useState(initialState)
    let decrement = () => setCount(count - 1)
    let increment = () => setCount(count + 1)
    return { count, decrement, increment }
}
 
let Theme = createContainer(useTheme)
let Counter = createContainer(useCounter)
 
function MyBlock() {
    let counter = Counter.useContainer()
    let theme = Theme.useContainer()
    return (
        <div style={{backgroundColor: theme.theme === 0 ? 'white' : '#333333', color: theme.theme === 1 ? 'white' : '#333333'}}>
            <p>
                Hello world
            </p>
            <button onClick={theme.anotherTheme}>
                Change theme
            </button>
            <p>
                Counter
            </p>
            <button onClick={counter.decrement}>-</button>
                <span>{counter.count}</span>
            <button onClick={counter.increment}>+</button>
        </div>
    )
}
 
function App() {
    return (
        <Provider containers={[
            {container: Theme, initialState: 1},
            {container: Counter, initialState: 0}
        ]}>
            <MyBlock />
        </Provider>
    )
}
 
render(<App />, document.getElementById("root"))
```
