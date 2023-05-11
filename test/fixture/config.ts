/* eslint-disable import/no-anonymous-default-export */
export default {
   theme: './theme',
   extends: [['configerium-npm-test', { userMeta: 123 }]],
   $test: {
      extends: ['./config.dev'],
      envConfig: true,
   },
   colors: {
      primary: 'user_primary',
   },
   configFile: true,
   overriden: false,
   // foo: "bar",
   // x: "123",
   array: ['a'],
}
