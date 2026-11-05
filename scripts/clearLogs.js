import fs from 'fs';

const files = ['logs/app.log', 'logs/error.log', 'logs/request.log'];

files.forEach((file) => {
  fs.writeFileSync(file, '');
});

process.stdout.write('Logs limpos com sucesso.\n');
