FROM acs-reg.alipay.com/dockerlab/tnpm:centos6-v6.9.1-4.14.2

ENV PORT=80

USER root

COPY . /usr/app/site

WORKDIR /usr/app/site


RUN tnpm -v && tnpm install

# RUN npm rebuild node-sass

ADD ./scripts/entry.sh ./entry.sh

ENTRYPOINT ["./entry.sh"]

EXPOSE 80
