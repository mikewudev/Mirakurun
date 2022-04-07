ARG ARCH=
FROM ${ARCH}node:16.14.0-buster AS build
WORKDIR /app
ENV DOCKER=YES NODE_ENV=production
ADD . .
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends build-essential && \
    npm install --production=false && \
    npm run build && \
    npm install -g --unsafe-perm --production

FROM ${ARCH}node:16.14.0-buster-slim
WORKDIR /app
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        make \
        cmake \
        gcc \
        g++ \
        pkg-config \
        pcscd \
        libpcsclite-dev \
        libccid \
        libdvbv5-dev \
        pcsc-tools \
        dvb-tools \
        git \
        autoconf \
        automake \
        && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*


# Install libarib25
RUN git clone https://github.com/stz2012/libarib25.git /tmp/libarib25 && \
    cd /tmp/libarib25 && \
    cmake . && \
    make && \
    make install && \
    rm -rf /tmp/libarib25


# Install arib-b25-stream-test Decoder
RUN npm install arib-b25-stream-test -g --unsafe

# Install recpt1
RUN git clone https://github.com/stz2012/recpt1 /tmp/recpt1 && \
    cd /tmp/recpt1/recpt1 && \
    ./autogen.sh && \
    ./configure --enable-b25 && \
    make && \
    make install && \
    rm -rf /tmp/recpt1

COPY --from=build /usr/local/lib/node_modules/mirakurun /app


CMD ["./docker/container-init.sh"]
EXPOSE 40772 9229
