import {CanActivate, ExecutionContext, HttpException, HttpStatus, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {getConfig} from "../../utils";

export class AuthorizationGuard implements CanActivate {
  constructor(private readonly jwtService:JwtService) {
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    let token = request.headers.authorization
    if (!token) {
      throw new UnauthorizedException("token不存在")
    }
    token = token.split('Bearer ')[1]
    console.log(token)
    try {
      request['_user'] = await this.jwtService.verifyAsync(
        token,
        {
          secret: getConfig().secret
        }
      )
      console.log(request._user)
    } catch (e) {
      console.log(e)
      throw new HttpException('错误', HttpStatus.OK);
    }
    return true
  }
}