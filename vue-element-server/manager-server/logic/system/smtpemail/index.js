const Smtp = require('../../../db/models/system/smtpSchema.js')
const Counter = require('../../../db/models/system/counterSchema.js')
const util = require('../../../utils/util.js')
const nodemailer = require("nodemailer"); // 邮件发送模块
const smtpTransport = require("nodemailer-smtp-transport");
const {
    CODE,
    fail,
    success
} = util
const log4j = require('../../../utils/log4j.js')
const smtp = require('../../../db/models/system/smtpSchema.js')

const addSmtp = async (ctx) => {
    try {
        const {
            smtpName,
            sendName,
            smtpHost,
            smtpPort,
            enableSSL,
            userName,
            passWord,
            textModel
        } = ctx.request.body
        if (!smtpName || !sendName || !smtpHost || !smtpPort || !userName || !passWord || !textModel || !enableSSL) {
            return ctx.body = fail('请求参数错误', CODE.PARAM_ERROR)
        }

        const findId = await Counter.findOne({
            id: 'smtpId'
        })
        if (!findId) {
            await Counter.create({
                "id": "smtpId",
                "sequence_value": 1
            })
        }
        const count = await Counter.findOneAndUpdate({
            id: 'smtpId'
        }, {
            $inc: {
                sequence_value: 1
            }
        }, {
            new: true
        })
        const smtp = await new Smtp({
            smtpId: count.sequence_value,
            smtpName,
            sendName,
            smtpHost,
            smtpPort,
            enableSSL,
            userName,
            passWord,
            textModel
        })
        smtp.save()
        ctx.body = success()
    } catch (error) {
        ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
    }
}

const editSmtp = async (ctx) => {
    try {
        const {
            smtpId,
            smtpName,
            sendName,
            smtpHost,
            smtpPort,
            enableSSL,
            userName,
            passWord,
            textModel
        } = ctx.request.body
        if (!smtpId || !smtpName || !sendName || !smtpHost || !smtpPort || !userName || !passWord || !textModel || !enableSSL) {
            return ctx.body = fail('请求参数错误', CODE.PARAM_ERROR)
        }
        const filterSmtp = await Smtp.findOne({
            smtpId
        })
        if (!filterSmtp) {
            return ctx.body = fail('Smtp配置不存在', CODE.BUSINESS_ERROR)
        }
        const oneSmtp = await Smtp.findOneAndUpdate({
            smtpId
        }, {
            smtpName,
            sendName,
            smtpHost,
            smtpPort,
            enableSSL,
            userName,
            passWord,
            textModel
        })
        if (oneSmtp) {
            return ctx.body = success()
        } else {
            return ctx.body = fail('编辑SMTP配置失败', CODE.BUSINESS_ERROR)
        }
    } catch (error) {
        ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
    }
}

const enableSmtp = async (ctx) => {
    try {
        const {
            smtpId,
            isOnline
        } = ctx.request.body
        if (!smtpId || !isOnline && isOnline != false) {
            return ctx.body = fail('请求参数错误', CODE.PARAM_ERROR)
        }
        const filterSmtp = await Smtp.findOne({
            smtpId
        })
        if (!filterSmtp) {
            return ctx.body = fail('SMTP配置不存在', CODE.BUSINESS_ERROR)
        }
        const oneSmtp = await Smtp.findOneAndUpdate({
            smtpId
        }, {
            isOnline
        })
        if (oneSmtp) {
            if (isOnline) {
                //如果启用了该SMTP配置，则将其他的SMTP配置全部禁用
                await Smtp.updateMany({
                    smtpId: {
                        $ne: smtpId
                    }
                }, {
                    isOnline: false
                })
            }
            return ctx.body = success()
        } else {
            return ctx.body = fail('编辑SMTP配置失败', CODE.BUSINESS_ERROR)
        }
    } catch (error) {
        ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
    }
}

const getSmtp = async (ctx) => {
    try {
        const list = await Smtp.find({})
        ctx.body = success(list)
    } catch (error) {
        ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
    }
}

const deleteSmtp = async (ctx) => {
    try {
        const smtpId = ctx.params.id
        if (!smtpId) {
            return ctx.body = fail('请求参数错误', CODE.PARAM_ERROR)
        }
        await Smtp.deleteOne({
            smtpId
        })
        return ctx.body = success()
    } catch (error) {
        ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
    }
}

const testSmtp = async (ctx) => {
    try {
        const {
            smtpId,
            email
        } = ctx.request.body
        if (!email || !smtpId) {
            return ctx.body = fail('请求参数错误', CODE.PARAM_ERROR)
        }
        const filterSmtp = await Smtp.findOne({
            smtpId
        })
        if (!filterSmtp) {
            return ctx.body = fail('SMTP配置不存在', CODE.BUSINESS_ERROR)
        }
        const transport = nodemailer.createTransport(
            smtpTransport({
                host: filterSmtp.smtpHost, // 服务,这里使用的是163邮箱
                port: filterSmtp.smtpPort, // smtp端口，默认就是此 端口
                secure: filterSmtp.enableSSL, // true for 465, false for other ports
                auth: {
                    user: filterSmtp.userName, //发件人邮箱，即你的邮箱
                    pass: filterSmtp.passWord, // SMTP授权码,需要邮箱设置中获取
                },
            })
        );
        const regEmail =
            /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/; //验证邮箱正则

        if (regEmail.test(email)) {
            try {
                let result = await transport.sendMail({
                    from: filterSmtp.sendName, // 发件邮箱
                    to: email, // 收件列表
                    subject: "验证你的电子邮件", // 标题
                    html: `
                  <p>你好！</p>
                  <p>这是一封测试邮件，如果未进行此操作请忽略！</p>
                  `, // html 内容
                });
                return ctx.body = success()
            } catch (error) {
                transport.close(); // 如果没用，关闭连接池
                return ctx.body = fail('发送失败', CODE.BUSINESS_ERROR)
            }
        } else {
            return ctx.body = fail('邮箱格式错误', CODE.BUSINESS_ERROR)
        }
    } catch (error) {
        ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
    }
}

module.exports = {
    addSmtp,
    getSmtp,
    editSmtp,
    enableSmtp,
    deleteSmtp,
    testSmtp
}