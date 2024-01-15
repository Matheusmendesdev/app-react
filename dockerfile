# Use a imagem oficial do Node.js como base
FROM node:14

# Configurar o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copiar os arquivos do projeto para o contêiner
COPY . .

# Instalar as dependências
RUN npm install

# Expor a porta 3000 para acessar o aplicativo
EXPOSE 3000

# Comando para iniciar o aplicativo quando o contêiner for executado
CMD ["npm", "start"]