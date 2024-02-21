FROM btwiuse/arch:node

COPY . /app

WORKDIR /app

RUN yarn

ENV PORT=8000

EXPOSE 8000

CMD yarn dev
