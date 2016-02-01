FROM ubuntu

RUN echo "deb http://archive.ubuntu.com/ubuntu precise main universe" > /etc/apt/sources.list
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y git wget curl xz-utils


WORKDIR /root

RUN wget https://nodejs.org/dist/v4.2.6/node-v4.2.6-linux-x64.tar.xz
RUN mkdir /var/log/pm2 && \
	mkdir node && \
  ls
RUN tar xvf node-v*.tar.xz --strip-components=1 -C ./node
RUN ls
RUN pwd
RUN mkdir node/etc
RUN echo 'prefix=/usr/local' > node/etc/npmrc
RUN mv node /opt/
RUN ln -s /opt/node/bin/node /usr/local/bin/node && \
		ln -s /opt/node/bin/npm /usr/local/bin/npm

RUN npm install pm2 -g

EXPOSE 9000

ADD package.json /root/package.json
ADD server.js /root/server.js

RUN npm install
CMD ["pm2", "start", "server.js", "--no-daemon", "-e", "/var/log/pm2/err.log", "-o", "/var/log/pm2/out.log"]
