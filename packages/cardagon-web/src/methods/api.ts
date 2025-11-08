import defu from 'defu'
import { type FetchOptions, type IFetchError, ofetch } from 'ofetch'
import type { LoginResponse } from '../interfaces/api/LoginResponse'
import type { RegisterResponse } from '../interfaces/api/RegisterResponse'
import type { UserResponse } from '../interfaces/api/UserResponse'

/**
 * API
 *
 * @param url
 * @param init
 */
async function api<R = any>(url: string, init?: FetchOptions<'json'>) {
  const session = localStorage.getItem('session')
  const sessionToken = session ? JSON.parse(session)?.token : null

  let defaultOptions: FetchOptions<'json'> = {
    credentials: 'include',
  }

  if (sessionToken) {
    defaultOptions.headers = {
      Authorization: `Bearer ${sessionToken}`,
    }
  }

  const options = defu(init, defaultOptions)

  let data = null
  let error: IFetchError | null = null

  try {
    data = await ofetch<R>(url, options)
  } catch (e) {
    error = e as IFetchError
  }

  // Access error.data to force serialization of the data property
  if (error?.data) {
    error = {
      ...error,
      data: error?.data,
    }
  }

  return { data, error }
}

type APIOptions<Params extends undefined | Record<string, any> = undefined> =
  Omit<FetchOptions<'json'>, 'params'> &
    (Params extends undefined ? { params?: Params } : { params: Params })

function createEndpoint<
  Params extends undefined | Record<string, any> = undefined,
  Response = any,
>(url: string, defaultInit?: FetchOptions<'json'>) {
  return <ResponseType extends Response>(
    ...[init]: Params extends undefined
      ? [APIOptions<Params>?]
      : [APIOptions<Params>]
  ) => {
    const options = Object.assign({}, init)
    let urlToFetch = url?.toString()

    if (
      options?.params &&
      typeof options?.params === 'object' &&
      !Array.isArray(options?.params)
    ) {
      Object.entries(options.params).forEach(([key, value]) => {
        urlToFetch = urlToFetch.replace(new RegExp(`:${key}`, 'g'), value)
      })
    }

    if (options) {
      options.params = undefined
    }

    return api<ResponseType>(
      urlToFetch,
      defu(options, defaultInit) as APIOptions,
    )
  }
}

api.login = createEndpoint<undefined, LoginResponse>(
  '/api/v1/login/access-token',
  {
    method: 'POST',
  },
)

api.register = createEndpoint<undefined, RegisterResponse>('/api/v1/signup', {
  method: 'POST',
})

api.getMe = createEndpoint<undefined, UserResponse>('/api/v1/me', {
  method: 'GET',
})

export default api
