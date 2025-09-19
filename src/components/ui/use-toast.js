// Inspired by react-hot-toast library
import * as React from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

let count = 0

/**
 * Generates a unique ID for a toast.
 * @returns {string} The unique ID.
 */
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString();
}

const toastTimeouts = new Map()

/**
 * Adds a toast to the remove queue.
 * @param {string} toastId - The ID of the toast to remove.
 */
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

/**
 * @typedef {Object} ToastState
 * @property {Array<object>} toasts - The list of toasts.
 */

/**
 * @typedef {Object} ToastAction
 * @property {'ADD_TOAST' | 'UPDATE_TOAST' | 'DISMISS_TOAST' | 'REMOVE_TOAST'} type - The type of the action.
 * @property {object} [toast] - The toast object.
 * @property {string} [toastId] - The ID of the toast.
 */

/**
 * The reducer for the toast state.
 * @param {ToastState} state - The current state.
 * @param {ToastAction} action - The action to dispatch.
 * @returns {ToastState} The new state.
 */
export const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
}

const listeners = []

let memoryState = { toasts: [] }

/**
 * Dispatches an action to the toast state.
 * @param {ToastAction} action - The action to dispatch.
 */
function dispatch(action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

/**
 * @typedef {Object} ToastProps
 * @property {string} [title] - The title of the toast.
 * @property {string} [description] - The description of the toast.
 * @property {React.ReactNode} [action] - An action to display in the toast.
 */

/**
 * Displays a toast message.
 * @param {ToastProps} props - The props for the toast.
 * @returns {{id: string, dismiss: function, update: function}} The toast object.
 */
function toast({
  ...props
}) {
  const id = genId()

  const update = (props) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

/**
 * A hook for managing toast messages.
 * @returns {{toasts: Array<object>, toast: function, dismiss: function}} The toast state and actions.
 */
function useToast() {
  const [state, setState] = React.useState(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    };
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast }
