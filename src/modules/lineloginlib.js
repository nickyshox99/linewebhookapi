const crypto = require('crypto');
const https = require('https');


class LineLoginLib 
{
    constructor(CLIENT_ID, CLIENT_SECRET, CALLBACK_URL) 
    {
      this._CLIENT_ID = CLIENT_ID;
      this._CLIENT_SECRET = CLIENT_SECRET;
      this._CALLBACK_URL = CALLBACK_URL;
      this._STATE_KEY = 'random_state_str';
    }
  
    redirect(url) 
    {
      if (!res.headersSent) {
        res.setHeader('Location', url);
        res.statusCode = 302;
        res.end();
      } else {
        console.log(`<meta http-equiv="refresh" content="0;URL=${url}">`);
      }
    }
  
    authorize(stateKey) 
    {
      try 
      {
        // Your authorization logic here      
        const queryParams = new URLSearchParams({
          response_type: 'code',
          client_id: this._CLIENT_ID,
          redirect_uri: this._CALLBACK_URL,
          scope: 'openid profile',
          state: stateKey
        });
        const url = `https://access.line.me/oauth2/v2.1/authorize?${queryParams}`;  
        return url;
      } 
      catch (error) 
      {
        console.log(error);
        return "";
      }
      

    }

    requestAccessToken(params, returnResult = null, ssl = null) 
    {
      try {
        const SSL_VERIFYHOST = ssl ? 2 : 0;
        const SSL_VERIFYPEER = ssl ? 1 : 0;

        const code = params.code;
        const tokenURL = "https://api.line.me/oauth2/v2.1/token";

        const data = new URLSearchParams();
        data.append('grant_type', 'authorization_code');
        data.append('code', code);
        data.append('redirect_uri', this._CALLBACK_URL);
        data.append('client_id', this._CLIENT_ID);
        data.append('client_secret', this._CLIENT_SECRET);

        const options = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            },
            hostname: 'api.line.me',
            path: '/oauth2/v2.1/token',
            port: 443,
            rejectUnauthorized: SSL_VERIFYPEER,
        };

        const req = https.request(options, (res) => {
            let result = '';

            res.on('data', (chunk) => {
            result += chunk;
            });

            res.on('end', () => {
            const httpCode = res.statusCode;
            const parsedResult = JSON.parse(result);

            if (httpCode === 200) {
                if (parsedResult && parsedResult.access_token) {
                if (returnResult === null) {
                    return parsedResult.access_token;
                } else {
                    if (parsedResult.id_token) {
                    const userData = parsedResult.id_token.split('.');
                    const [alg, data] = userData.map((item) => Buffer.from(item, 'base64').toString('binary'));
                    parsedResult.alg = alg;
                    parsedResult.user = data;
                    }
                    return parsedResult;
                }
                } else {
                return null;
                }
            } else {
                if (returnResult === null) {
                return null;
                } else {
                return parsedResult;
                }
            }
            });
        });

        return data.toString();
      } catch (error) {
        console.log(error);
        return null;
      }
        
        
    }

    userProfile(accessToken, returnResult = null, ssl = null) 
    {
        const SSL_VERIFYHOST = ssl ? 2 : 0;
        const SSL_VERIFYPEER = ssl ? 1 : 0;
        const accToken = accessToken;
        const profileURL = "https://api.line.me/v2/profile";
    
        const headers = {
          'Authorization': `Bearer ${accToken}`
        };
    
        const options = {
          headers,
          hostname: 'api.line.me',
          path: '/v2/profile',
          port: 443,
          rejectUnauthorized: SSL_VERIFYPEER
        };
    
        const req = https.request(options, (res) => {
          let result = '';
    
          res.on('data', (chunk) => {
            result += chunk;
          });
    
          res.on('end', () => {
            const httpCode = res.statusCode;
            const parsedResult = JSON.parse(result);
    
            if (httpCode === 200) {
              if (parsedResult && parsedResult.userId) {
                if (returnResult === null) {
                  return parsedResult.userId;
                } else {
                  return parsedResult;
                }
              } else {
                return null;
              }
            } else {
              if (returnResult === null) {
                return null;
              } else {
                return parsedResult;
              }
            }
          });
        });
    
        req.end();
    }

    verifyToken(accessToken, returnResult = null, ssl = null) 
    {
      try 
      {
        const SSL_VERIFYHOST = ssl ? 2 : 0;
        const SSL_VERIFYPEER = ssl ? 1 : 0;
        const accToken = accessToken;
        const verifyURL = "https://api.line.me/oauth2/v2.1/verify";
    
        const data = {
          'access_token': accToken
        };
    
        const options = {
          hostname: 'api.line.me',
          path: '/oauth2/v2.1/verify?' + new URLSearchParams(data),
          port: 443,
          rejectUnauthorized: SSL_VERIFYPEER
        };
    
        const req = https.request(options, (res) => {
          let result = '';
    
          res.on('data', (chunk) => {
            result += chunk;
          });
    
          res.on('end', () => {
            const httpCode = res.statusCode;
            const parsedResult = JSON.parse(result);
    
            if (httpCode === 200) {
              if (parsedResult && parsedResult.scope) {
                if (returnResult === null) {
                  return parsedResult.scope;
                } else {
                  return parsedResult;
                }
              } else {
                return null;
              }
            } else {
              if (returnResult === null) {
                return null;
              } else {
                return parsedResult;
              }
            }
          });
        });
    
        return null;
      } 
      catch (error) 
      {
        console.log(error);

      }
        
    }

    refreshToken(refreshToken, data, returnResult = null, ssl = null) 
    {
        const SSL_VERIFYHOST = ssl ? 2 : 0;
        const SSL_VERIFYPEER = ssl ? 1 : 0;
        const tokenURL = "https://api.line.me/oauth2/v2.1/token";
    
        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };
    
        const requestBody = {
          'grant_type': 'refresh_token',
          'refresh_token': refreshToken,
          'client_id': this._CLIENT_ID,
          'client_secret': this._CLIENT_SECRET
        };
    
        const options = {
          headers,
          hostname: 'api.line.me',
          path: '/oauth2/v2.1/token',
          port: 443,
          method: 'POST',
          rejectUnauthorized: SSL_VERIFYPEER
        };
    
        const req = https.request(options, (res) => {
          let result = '';
    
          res.on('data', (chunk) => {
            result += chunk;
          });
    
          res.on('end', () => {
            const httpCode = res.statusCode;
            const parsedResult = JSON.parse(result);
    
            if (httpCode === 200) {
              if (parsedResult && parsedResult.access_token) {
                if (returnResult === null) {
                  return parsedResult.access_token;
                } else {
                  return parsedResult;
                }
              } else {
                return null;
              }
            } else {
              if (returnResult === null) {
                return null;
              } else {
                return parsedResult;
              }
            }
          });
        });
    
        req.write(new URLSearchParams(requestBody).toString());
        req.end();
    }

    revokeToken(accessToken, returnResult = null, ssl = null) 
    {
        const SSL_VERIFYHOST = ssl ? 2 : 0;
        const SSL_VERIFYPEER = ssl ? 1 : 0;
        const accToken = accessToken;
        const revokeURL = "https://api.line.me/oauth2/v2.1/revoke";
    
        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };
    
        const requestBody = {
          'access_token': accToken,
          'client_id': this._CLIENT_ID,
          'client_secret': this._CLIENT_SECRET
        };
    
        const options = {
          headers,
          hostname: 'api.line.me',
          path: '/oauth2/v2.1/revoke',
          port: 443,
          method: 'POST',
          rejectUnauthorized: SSL_VERIFYPEER
        };
    
        const req = https.request(options, (res) => {
          const httpCode = res.statusCode;
    
          if (httpCode === 200) {
            return true;
          } else {
            return null;
          }
        });
    
        req.write(new URLSearchParams(requestBody).toString());
        req.end();
    }

    setStateKey(stateKey) 
    {
        this._STATE_KEY = stateKey;
    }

    randomToken(length = 32) 
    {
        if (!length || parseInt(length) <= 8) {
          length = 32;
        }
    
        if (crypto.randomBytes) {
          return crypto.randomBytes(length).toString('hex');
        }
    
        if (crypto.pseudoRandomBytes) {
          return crypto.pseudoRandomBytes(length).toString('hex');
        }
    
        throw new Error('No suitable cryptographic function available.');
    }
}
  
module.exports = LineLoginLib;