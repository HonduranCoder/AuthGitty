/* eslint-disable no-console */
const exchangeCode = async (code) => {
  console.log(`MOCK INVOKED: exchangeCode(${code})`);
  return `MOCK_TOKEN_FOR_CODE_${code}`;
};
//login and email
const getProfile = async (token) => {
  console.log(`MOCK INVOKED: getProfile(${token})`);
  return {
    login: 'fake_login',
    email: 's@s.com',
  };
};

module.exports = { exchangeCode, getProfile };
