import { useEffect, useReducer, useRef } from "react";

enum ApiType {
  INIT = "FETCH_INIT",
  SUCCESS = "FETCH_SUCCESS",
  FAILURE = "FETCH_FAILURE",
}
interface ApiAction {
  type: ApiType;
  payload?: any;
}
interface ApiStatus {
  isLoading: boolean;
  isError: boolean;
  data: any;
}

function dataFetchReducer(state: ApiStatus, action: ApiAction) {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isError: false,
        isLoading: true,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isError: true,
        isLoading: false,
      };
    default:
      return state;
  }
}

function useDataApi(api: (params?: any) => Promise<any>) {
  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: null,
  });
  const submittingStatus = useRef(true);

  useEffect(() => {
    if (submittingStatus.current) {
      submittingStatus.current = false;
      dispatch({ type: ApiType.INIT });
      api()
        .then((res) => {
          dispatch({ type: ApiType.SUCCESS, payload: res});
        })
        .catch((err) => {
          dispatch({ type: ApiType.FAILURE });
        });
    }
  }, [api]);
  return { ...state };
}

export default useDataApi;
