// 通用数据请求层
// 全组统一通过这里访问后端，禁止在业务页面里直接裸写 fetch。
// 严格区分两层异常：
//   1) HTTP 层：响应状态码非 2xx（断网 / 后端宕机 / 404 等）
//   2) 业务层：HTTP 200 但后端返回 code !== 0
// 只有两层都通过，才把 result.data 交给页面。

// 后端地址统一走相对路径（/api/...），不要写死 http://localhost:8081
// 否则手机真机调试时 localhost 指向手机自己，必然连不上。

export async function getData(path) {
  let response
  try {
    response = await fetch(path)
  } catch (e) {
    // 断网、DNS 失败、CORS 被拦（非代理场景）等，fetch 会直接 reject
    throw new Error('网络连接失败，请检查网络后重试')
  }

  // HTTP 层异常：状态码不在 200~299
  if (!response.ok) {
    throw new Error('网络请求异常：HTTP ' + response.status)
  }

  // 响应体必须是 JSON；若后端返回非 JSON（如 502 网关页），解析会抛错
  let result
  try {
    result = await response.json()
  } catch (e) {
    throw new Error('返回数据格式异常，无法解析')
  }

  // 业务层异常：约定 code === 0 为成功
  if (result.code !== 0) {
    throw new Error(result.message || '业务处理失败')
  }

  return result.data
}
