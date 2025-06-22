# pip install transformers torch datasets numpy scikit-learn matplotlib nlpaug flask

# FROM python:3.13 AS base
# WORKDIR /app
# RUN pip --no-cache-dir install transformers torch datasets numpy scikit-learn matplotlib nlpaug flask flask_restx
# COPY server.py .
# EXPOSE 5000
# ENV PYTHONUNBUFFERED=1
# CMD ["python", "server.py"]

FROM python:3.13 AS base

# # 安装 uv（官方推荐方式）
# RUN apt-get update && apt-get install -y curl \
#     && curl -LsSf https://astral.sh/uv/install.sh | sh \
#     && echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc \
#     && export PATH="$HOME/.cargo/bin:$PATH"

# # 设置 PATH（uv 安装在 ~/.cargo/bin 里）
# ENV PATH="/root/.cargo/bin:${PATH}"

# 拷贝项目文件
WORKDIR /app
COPY requirements.txt /app/requirements.txt

# RUN pip install --no-cache-dir -r /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple


# 使用 uv pip 安装依赖
# RUN uv pip install transformers torch datasets numpy scikit-learn matplotlib nlpaug flask flask_restx

# 预先下载模型
# RUN python -c "from transformers import AutoTokenizer, AutoModel; AutoTokenizer.from_pretrained('bert-base-chinese'); AutoModel.from_pretrained('bert-base-chinese')"

COPY server.py .
EXPOSE 5000
ENV PYTHONUNBUFFERED=1
CMD ["python", "server.py"]
