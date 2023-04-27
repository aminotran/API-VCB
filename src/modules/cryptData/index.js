const forge = require('node-forge');


const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5YAgsiwcaeCo5P4FXb8d
WCbA8azicu0kBWBsSrl0845krcGwco1Atn1e0/uR1zhy5fpF5MTr2biRLjXzZd3R
oRVowm8pYSfGY+w7ZkcMefRNo50Iy1mdJdMxhKikCRNHuhtX9lMCxkOdkwsxJAzp
CWnUSUxfrinxbLiALHfvh19v9jEwNY0vMhx4gR/lDJFZJYy2HZiyp/GoY4GLPi5n
Yyze2qlBst2k1UnUv++Af8IQ/fRZQGAJNWmmUnot/48zDoUzOt8MJAKLCYPDba+k
0iB3r6bBm1Coa/PjtwMmmZotj7t7fySFpgi+fSqu99zdWW6+vvg5PlCxPSs7Ukf3
lwIDAQAB
-----END PUBLIC KEY-----`;


const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA5YAgsiwcaeCo5P4FXb8dWCbA8azicu0kBWBsSrl0845krcGw
co1Atn1e0/uR1zhy5fpF5MTr2biRLjXzZd3RoRVowm8pYSfGY+w7ZkcMefRNo50I
y1mdJdMxhKikCRNHuhtX9lMCxkOdkwsxJAzpCWnUSUxfrinxbLiALHfvh19v9jEw
NY0vMhx4gR/lDJFZJYy2HZiyp/GoY4GLPi5nYyze2qlBst2k1UnUv++Af8IQ/fRZ
QGAJNWmmUnot/48zDoUzOt8MJAKLCYPDba+k0iB3r6bBm1Coa/PjtwMmmZotj7t7
fySFpgi+fSqu99zdWW6+vvg5PlCxPSs7Ukf3lwIDAQABAoIBACHsIWkUmhKQUYaf
gX2M3TKFb+mJC2O/Z56f1QHqjb3eY0VHpuQXuuP+fgDJY5IzVtBlgOVCsjXZUSRK
dzKsaersdjKfKbehoHJunY0NnWt9T+iKMp2UHmVT5TLdlnl87xI0LnlLZdKWdfkh
I19XxS5OBUHcVxwwOO5ACzoHdFFG403g7YaeR/whkxrv/M5LDIQVeAfNgDlvkr6P
o1/DjAwWgXbR42qJPl7HW7MwmdE4hM2gUJgVZGose4dh67Hr458aVK6IvgIswWGT
KIx6OPWNPT7vmmGfjWgc4PWaX8zvGLneoVm6aOf99Rct4vmEhjNaz6KxqJnBBRPC
CHdUPDECgYEA/16YhrdraLoEcHorkt5kVo75m25NwX9QZVPQmk7OVh1JG7qj6Gcb
UCYwIzdRKpQjJ6NOWT8Ff8j9DAXq8xJTvbnxtslFmp4Oewzcf7lbRrzwSIomFA0f
sFbZCRtB4Leyf+0NJVU/r9QR+fepeuUFZ+2MSmyv20x8zsSXc37zr68CgYEA5hEu
flKcijsPCjUDtVqoFiQKJ9aaMkbk9q7nnuT90PV7zz8dyact/2BhiUwKGv4VnytQ
cw8EUXZWTlnXKbNJ2Map2WRE1fLdsLwT2bbzr3U+6NG0wey/3ChjoejOywOuf7S4
qe2lcjSew1QjrHBNJXS8xP1/HcTAwX7quFRhiJkCgYEAosB/JRyw78XeHnE+ZBQo
jqIAovbhx3iEnI+WW0HubyOq/GkvHWbZGXO9KjSPHjvbS9/ghzCLKK3H2GnNG62K
gViInJ4aJjilsfa4cQ6JBcRUv2aMbisPDyvKluswSS/KK43A2xJBzKWz70PQV+qu
T1YuGyC502IkCQNyIsG+PTECgYB0U8Gva7PtDNmY7p9WZmVQ9J4R8Kd8vm3s8Rj6
NYzEyCr26lH0cUyHsMMAeesuJMTn+y2tT61+Rxhye2iYlCfFrQWafuFzUF6Ziy96
SNBEKkNJ0ybTWxLTjbR63E0bR1xHBCjO+vNJoKOZ3gQ/n3TSeIkuDYLlmWNhMvwZ
gcjjGQKBgHKySIYCMsR6Y7mE5kwlhqufIl+4sG9os9dyrdmPF2IQGyNqb4lNROlo
2jqpXOTzJiHtAuYqiDVTHSuim3FtwKzff6hOC8fKIqvuiLr9+m/eh8ZPGs6CIiHK
4sgmMPlcpuQvI3vRgsk2sIUtzfKpOMvyaX/Jio1jVeiLCNiPERJl
-----END RSA PRIVATE KEY-----
`;


const encryptData = text => {
    const key = forge.pki.publicKeyFromPem(publicKey);
    const encrypted = key.encrypt(text);
    return forge.util.encode64(encrypted);
};

const decryptData = text => {
    const key = forge.pki.privateKeyFromPem(privateKey);
    const textBase64 = forge.util.decode64(text);
    return key.decrypt(textBase64);
};


module.exports = {encryptData, decryptData};