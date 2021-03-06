import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import uuidv4 from 'uuid/v4'
import TodosContext from '../context'
import { jsonServerURL } from '../constants'

export default function TodoForm() {
  const [todo, setTodo] = useState('')
  const {
    state: { currentTodo = {} },
    dispatch
  } = useContext(TodosContext)

  useEffect(
    () => {
      if (currentTodo.text) {
        setTodo(currentTodo.text)
      } else {
        setTodo('')
      }
    },
    [currentTodo.id]
  )

  const handleSubmit = async event => {
    event.preventDefault()
    if (currentTodo.text) {
      const response = await axios.patch(`${jsonServerURL}/${currentTodo.id}`, {
        text: todo
      })
      dispatch({ type: 'UPDATE_TODO', payload: response.data })
    } else {
      const response = await axios.post(jsonServerURL, {
        id: uuidv4(),
        text: todo,
        complete: false
      })
      dispatch({ type: 'ADD_TODO', payload: response.data })
    }
    setTodo('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex justify-center p-5">
      <input
        type="text"
        onChange={event => setTodo(event.target.value)}
        value={todo}
        className="border-black border-solid border-2"
      />
    </form>
  )
}
