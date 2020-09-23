import { Injectable, OnModuleInit } from '@nestjs/common';
import { Provider, Configuration, KoaContextWithOIDC, Account } from 'oidc-provider';
import * as os from 'os';

const configuration: Configuration = {
  clients: [{
    client_id: 'foo',
    client_secret: 'bar',
    redirect_uris: ['http://localhost:4200'],
  }, {
      redirect_uris: ['http://localhost:4200'],
      client_id: 'foo2',
      response_types: ['code'],
      scope: 'openid profile email offline_access api',
      showDebugInformation: true,
      timeoutFactor: 0.01
    }],
  interactions: {
    url: (ctx: KoaContextWithOIDC): string => {
      return `/oidc/interaction/${ctx.oidc.uid}`;
    }
  },
  findAccount: ()=> {
    const a: Account = {
      displayName: 'name', id: '123', rpDisplayName: 'something',
      accountId: 'test', claims: () => ({sub: '1235', email: 'test@test.com', })
    };
    return a;
  }
}


@Injectable()
export class AppService implements OnModuleInit {
  oidc: Provider;
  onModuleInit() {
    console.log('hostname', os.hostname());
    this.oidc = new Provider('http://localhost:3000', configuration);
  }
  getData(): { message: string } {
    return { message: 'Welcome to sso-server!' };
  }

}
