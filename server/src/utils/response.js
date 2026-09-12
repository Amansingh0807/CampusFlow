export const ok = (response, data, message = 'Success', status = 200) => response.status(status).json({ success: true, message, data })
export const fail = (message, status = 400) => Object.assign(new Error(message), { statusCode: status })
