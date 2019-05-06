import service from './request'
class Login {
  login(params) {
    return service.post('sysUser/login', params)
  }
}
export default new Login()
