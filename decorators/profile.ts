import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { IUserInfo } from 'typings'

/**
 * 获取用户信息
 */
export const Profile = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  return request.user as IUserInfo
})
