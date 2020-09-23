import { All, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { AppService } from './app.service';

@Controller(  )
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('/interaction/:uid/login')
  async login(@Req() req: Request, @Res() res: Response): Promise<void> { 
    console.log('void executed')
    try {
      const { prompt: { name } } = await this.appService.oidc.interactionDetails(req, res);
      // assert.equal(name, 'login');
      // const account = await Account.findByLogin(req.body.login);

      const result = {
        select_account: {}, // make sure its skipped by the interaction policy since we just logged in
        login: {
          account: '123',
        },
      };

      await this.appService.oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
    } catch (err) {
      console.log(err);
      // next(err);
    }
  }

  @All('/*')
  public rewriteToProvider(@Req() req: Request, @Res() res: Response): void { 
    console.log('url', req.originalUrl);
    // req.url = req.originalUrl.replace(`/?`, '?');
    req.url = req.originalUrl.replace(`/oidc`, '');
    return this.appService.oidc.callback(req, res);
  }
}
