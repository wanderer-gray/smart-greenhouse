## Launch
- `git clone git@github.com:wanderer-gray/smart-greenhouse.git`
- `cd smart-greenhouse`
- `npm install`
- `npm start`

## Config
Path: `smart-greenhouse/config.js`
- server
- knex
- cookie

## OpenAPI
- View: `host:port/documentation`
- Example: `http://127.0.0.1:3080/documentation`

### Auth
- Для регистрации в системе и восстановления доступа к системе необходимо получить электронное сообщение с токеном.
- Для отправки почты используются заглушки. В консоле будет отображена ссылка (например, `https://ethereal.email/message`), после отправки электронного сообщения.
