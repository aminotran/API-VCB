const forge = require('node-forge');

const defaultPublicKey = `LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUFpa3FRckl6WkprVXZIaXNqZnU1WkNOK1RMeS8vNDNDSWM1aEpFNzA5VElLM0hiY0M5dnVjMitQUEV0STZwZVNVR3FPbkZvWU93bDNpOHJSZFNhSzE3RzJSWk4wMU1JcVJJSi82YWM5SDRMMTFkdGZRdFI3S0hxRjdLRDBmajZ2VTRrYjUrMGN3UjNSdW1CdkRlTWxCT2FZRXBLd3VFWTlFR3F5OWJjYjVFaE5HYnh4TmZiVWFvZ3V0VndHNUMxZUtZSXR6YVlkNnRhbzNncTdzd05IN3A2VWRsdHJDcHhTd0ZFdmM3ZG91RTJzS3JQRHA4MDdaRzJkRnNsS3h4bVI0V0hESFdmSDBPcHpyQjVLS1dRTnl6WHhUQlhlbHFyV1pFQ0xSeXBOcTdQKzFDeWZnVFNkUTM1ZmRPN00xTW5pU0JUMVYzM0xkaFhvNzMvOXFENWU1VlFJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0t`;

const clientPublicKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDEWbuV2pUmo/9Dh6C66yMfGB60bfnmtDTxuZcBTA4FhZL/zissoNC/YnB7aBOggqdy/XurNFybhSAYhRByMlf0g92FyH++EVCXbCB6Qc7Y2MdHbI06clOTTJTV5JSPhBe4wOUwN5pTYOZcTDP7Ie4FOv2HDZdJqicccCHVkjSw2wIDAQAB`;
const clientPrivateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQDEWbuV2pUmo/9Dh6C66yMfGB60bfnmtDTxuZcBTA4FhZL/ziss
oNC/YnB7aBOggqdy/XurNFybhSAYhRByMlf0g92FyH++EVCXbCB6Qc7Y2MdHbI06
clOTTJTV5JSPhBe4wOUwN5pTYOZcTDP7Ie4FOv2HDZdJqicccCHVkjSw2wIDAQAB
AoGAdopuE8SJM3DjFVP2l6KJ66XWM7wJmVzGcgFHx0KxXGgOHV3M9v6HyGOX4Qku
gEMg8O1UEkJkfofanrMHAMqgCjBIvE5kI9wDaFLzqtwvbfE+A9Je386lhJcX4NVo
Lx9zrm/eeYBZ0XCI9Bgw0jNbtvjk88bAmBHSBhLaK+34goECQQD8ht6eW6jqnT+0
zRuygKr38UKG1XmwjMY+F4o5RHkM0bB2mTmxDmTPykI9eddFtS/2nu39JrP2Q6H3
eQSmIaXhAkEAxw0R7bglJP9GVbdccEJtsixWcfy8sl5xC99Yciyj/AlyNdhRlPQk
b3mhhfDtXfaJiS/kQ0e9UtJvw5HhcjY2OwJALHZGrhUvaZekRt4yOTykXaFx+DGQ
CoDOytH0OV8P/SzSaB9UZBNHtrpC7XYNbC2Zs0+KUZ9F4l9IHj2FjwavoQJAKP5X
F+cZt0HfgV2u6uuzXcNl1jnfvrhWfcR0mab56rkjTVWMj6msK00YZ9ZTfEt+zcMQ
No76vajbHaLYlEX36wJBAMAefQpFkfewA/Z+cPFBtoIY02e9JXuBV4IsHsARL0ey
tjbzm916IDo09OXy8U+MPNtGQT5U44BTFtXDzgF+gUY=
-----END RSA PRIVATE KEY-----
`;

class VCBCrypt {
    constructor() {
        this.isActive = !1;
        this.keys = null;
        this.clientPublicKey = null;
        this.clientPrivateKey = null;
    }
    encryptRequest(e) {
        try {
            const passwordCipher = forge.random.getBytesSync(32);
            const iv = forge.random.getBytesSync(16);
            e = Object.assign({
                clientPubKey: clientPublicKey,
            }, e);
            const cipher = forge.cipher.createCipher('AES-CTR', passwordCipher);
            cipher.start({
                iv,
            });
            cipher.update(forge.util.createBuffer(forge.util.encodeUtf8(JSON.stringify(e))));
            cipher.finish();
            const data = Buffer.concat([Buffer.from(iv, 'binary'), Buffer.from(cipher.output.data, 'binary')]);
            const key = forge.pki.publicKeyFromPem(forge.util.decode64(defaultPublicKey)).encrypt(forge.util.encode64(passwordCipher));

            return {
                d: data.toString('base64'),
                k: forge.util.encode64(key),
            };
        } catch (n) {
            console.log(n);
        }
    }

    decryptResponse(e) {
        const { k, d } = e;

        const privateKey = forge.pki.privateKeyFromPem(clientPrivateKey);
        const dataIsDecrypted = forge.util.decodeUtf8(privateKey.decrypt(forge.util.decode64(k)));
        const key = Buffer.from(d, 'base64');
        const ivSlide = key.slice(0, 16);
        const data = forge.cipher.createDecipher('AES-CTR', Buffer.from(dataIsDecrypted, 'base64').toString('binary'));

        return data.start({
            iv: ivSlide.toString('binary'),
        }),
            data.update(forge.util.createBuffer(key.slice(16))),
            data.finish(),
            forge.util.decodeUtf8(data.output.data);
    }
}

module.exports = new VCBCrypt();
