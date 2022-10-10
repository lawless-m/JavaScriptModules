export var user;
export var action;

/**  
 * loadAuth(appId, onrespons) add Office365 auth
 * @param appId: Application (client) ID from Azure
 * @param onresponse this is called after the process is complete, returns two functions, one for login, one for logout
 */

export function loadAuth(appId, onresponse) {
    let e = document.createElement('script');
    e.src = 'https://alcdn.msauth.net/browser/2.28.3/js/msal-browser.min.js';
    e.async = true;
    e.addEventListener('load', () => {
        const msalClient = new msal.PublicClientApplication({ auth: { clientId:appId } });
        msalClient
        .handleRedirectPromise()
        .then(() => { 
            let accounts = msalClient.getAllAccounts();
            user = (accounts.length > 0) ? accounts[0] : undefined;
            action = evt => { evt.preventDefault(); user ? msalClient.logoutRedirect() : msalClient.loginRedirect()}
            onresponse();
        });                
    }, false);
    document.head.appendChild(e);    
}
