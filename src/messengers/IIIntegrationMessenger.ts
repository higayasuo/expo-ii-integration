import { IframeMessenger, type ErrorFunc } from '@higayasuo/iframe-messenger';

export type IIIntegrationSuccessResponse = {
  kind: 'success';
  delegation: string;
};

export type IIIntegrationResponse = IIIntegrationSuccessResponse;

export class IIIntegrationMessenger extends IframeMessenger<IIIntegrationResponse> {
  constructor(errorFunc: ErrorFunc = console.error) {
    super(errorFunc);
  }
}