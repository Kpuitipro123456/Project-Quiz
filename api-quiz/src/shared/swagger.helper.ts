import {DiscoveryService} from '@golevelup/nestjs-discovery';
import {Reflector} from '@nestjs/core';
import {INestApplication} from '@nestjs/common';

export const injectEndpointPolicyToSwaggerMetadata = async (app: INestApplication) => {
  const discoveryService = app.get(DiscoveryService);
  const reflector = app.get(Reflector);
  const decoratedMethods = await discoveryService.methodsAndControllerMethodsWithMetaAtKey<any>(
    'auth',
  );
  for (const decoratedMethod of decoratedMethods) {
    const endpointOperation = reflector.get(
      'swagger/apiOperation',
      decoratedMethod.discoveredMethod?.handler,
    );
    // override description metadata of swagger operation to include policy JSON
    Reflect.defineMetadata(
      'swagger/apiOperation',
      {
        ...endpointOperation,
        description: `${
          endpointOperation.description || ''
        }<br><br>***Endpoint policy***<br>${convertPolicyToText(decoratedMethod.meta[0])}`,
      },
      decoratedMethod.discoveredMethod?.handler,
    );
  }
};

const convertPolicyToText = (policies: {namespace: string; permissions: string[]}[]): string => {
  let res = '';
  for (let i = 0, len = policies.length; i < len; i++) {
    const policy = policies[i];
    res += `**${policy.namespace}**: ${policy.permissions.join(', ')}<br>`;
  }
  return res;
};
