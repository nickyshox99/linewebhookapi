# ใช้ Node.js บน Debian base เพื่อรองรับ native libs
FROM node:18

# ติดตั้ง system dependencies สำหรับ canvas / sharp / ฯลฯ
RUN apt-get update && apt-get install -y \
    libcairo2-dev \
    libjpeg-dev \
    libpango1.0-dev \
    libgif-dev \
    librsvg2-dev \
    build-essential \
    python3 \
    make \
    g++ \
 && rm -rf /var/lib/apt/lists/*

# กำหนด working directory
WORKDIR /linewebhookapi

# คัดลอก package files ก่อน เพื่อใช้ Docker cache
COPY package.json package-lock.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอก source code ที่เหลือทั้งหมด
COPY . .

# เปิดพอร์ต (Render ใช้ ENV $PORT)
EXPOSE ${PORT}

# รันแอป
CMD ["node", "app.js"]
