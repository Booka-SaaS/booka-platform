import { extractTokenFromSoapEnvelope } from '../../services/notification-service/src/soap.controller';

describe('notification SOAP contract', () => {
  it('extracts token from GetNotificationSummary request', () => {
    const token = extractTokenFromSoapEnvelope(`
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <GetNotificationSummaryRequest>
            <token>abc.123.token</token>
          </GetNotificationSummaryRequest>
        </soap:Body>
      </soap:Envelope>
    `);

    expect(token).toBe('abc.123.token');
  });
});
