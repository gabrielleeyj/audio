import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer
} from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import {isFn, isString} from '../utils/type-check';

/**
 * Snack React context.
 * @constant
 * @type {React.Context<SnackCtxProps>}
 */
export const SnackCtx = createContext({});

const AUTO_HIDE_DURATION = 6000; // 6s

const noDismiss = {
  mouseEvent: false,
  touchEvent: false
};

const SHOW_SNACK = 'show-snack';
const HIDE_SNACK = 'hide-snack';

const origin = {
  vertical: 'bottom',
  horizontal: 'left',
};

/**
 * @constant
 * @type {SnackCtxState}
 */
const initialState = {
  visible: false,
  message: '',
  position: origin,
};


export function useSnackCtx() {
  const [state, dispatch] = useReducer(reducer, initialState);

  /**
   * Show the snack
   * @constant
   * @type {ShowCb}
   */
  const show = useCallback((message, opts = {}) => {
    const {action, actionLabel, keepOnScreen, autoHide, severity, position} = opts;
    const payload = {
      message,
      actionLabel,
      keepOnScreen,
      autoHide,
      severity,
      position: {
        ...origin,
        ...position,
      }
    };

    if (isFn(action)) {
      Object.assign(payload, {
        action: () => {
          dispatch({type: HIDE_SNACK});
          action();
        }
      });
    }

    dispatch({
      payload,
      type: SHOW_SNACK
    });
  }, []);

  /**
   * Hide the snack
   * @constant
   * @type {HideCb}
   */
  const hide = useCallback(() => {
    dispatch({type: HIDE_SNACK});
  }, []);

  return {
    ...state,
    show,
    hide
  };
}

export function useSnack() {
  const {show, hide} = useContext(SnackCtx);
  return {show, hide};
}

export default function Snack() {
  const {
    hide,
    visible,
    key,
    message,
    action,
    keepOnScreen,
    autoHide,
    severity,
    position,
  } = useContext(SnackCtx);
  const timeout = action
    ? null
    : autoHide
      ? AUTO_HIDE_DURATION
      : null;
  const caListenerProps = keepOnScreen
    ? noDismiss
    : null;

  const hasSeverity = useMemo(() => isString(severity), [severity]);

  return (
    <Snackbar
      key={key}
      anchorOrigin={position}
      open={visible}
      ClickAwayListenerProps={caListenerProps}
      autoHideDuration={timeout}
      onClose={hide}
      message={hasSeverity ? null : message}
      action={hasSeverity ? null : action}
    >
      {
        hasSeverity
          ? (
            <Alert
              onClose={hide}
              severity={severity}
              action={action}
              variant="filled"
            >
              {message}
            </Alert>
          )
          : null
      }
    </Snackbar>
  );
}

/**
 * State reducer for our app
 * @param {SnackCtxState} state
 * @param {Action} act
 */
function reducer(state, act) {
  switch (act.type) {
    case SHOW_SNACK:
      const key = new Date().getTime();
      const {message, action, keepOnScreen, autoHide, severity, position} = act.payload;

      if (isFn(action)) {
        const actionLabel = isString(act.payload.actionLabel)
          ? act.payload.actionLabel
          : 'Retry';
        return {
          ...state,
          key,
          message,
          keepOnScreen,
          autoHide,
          severity,
          visible: true,
          position: {
            ...state.position,
            ...position,
          },
          action: (
            <Button
              onClick={action}
              // color="secondary"
              size="small"
            >
              {actionLabel}
            </Button>
          )
        };
      }

      return {
        ...state,
        key,
        message,
        autoHide,
        keepOnScreen,
        severity,
        position: {
          ...state.position,
          ...position,
        },
        action: undefined,
        visible: true,
      };
    case HIDE_SNACK:
      return {
        ...state,
        visible: false
      };
    default:
      return state;
  }
}

/**
 * @typedef {SnackCtxState & SnackCtxMethods} SnackCtxProps
 */

/**
 * @typedef {object} Action
 * @property {string} type
 * @property {SnackCtxState} payload
 */

/**
 * @typedef {object} SnackCtxState
 * @property {number} [key]
 * @property {boolean} [visible]
 * @property {string} [message]
 * @property {boolean} [keepOnScreen]
 * @property {boolean} [autoHide]
 * @property {Severity} [severity]
 * @property {React.ReactNode} [action]
 * @property {Position} [position]
 */

/**
 * @typedef {import('@material-ui/lab/Alert').Color} Severity
 */

/**
 * @typedef {object} SnackCtxMethods
 * @property {ShowCb} show
 * @property {HideCb} hide
 */

/**
 * @callback ShowCb
 * @param {string} msg
 * @param {ShowOptions} [options]
 * @returns {void}
 */

/**
 * @typedef {object} ShowOptions
 * @property {() => void} [action]
 * @property {string} [actionLabel]
 * @property {boolean} [keepOnScreen]
 * @property {boolean} [autoHide]
 * @property {Severity} [severity]
 * @property {Position} [position]
 */

/**
 * @typedef {import('@material-ui/core').SnackbarOrigin} Position
 */

/**
 * @callback HideCb
 * @returns {void}
 */

