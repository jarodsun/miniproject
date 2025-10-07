export function validatePhone(phone: string): boolean {
    // 中国大陆手机号验证
    const chinaPhoneRegex = /^1[3-9]\d{9}$/
    // 国际号码验证（简化版）
    const internationalPhoneRegex = /^\+?[1-9]\d{1,14}$/
    
    return chinaPhoneRegex.test(phone) || internationalPhoneRegex.test(phone)
  }
  
  export function validateName(name: string): boolean {
    return name.length >= 2 && name.length <= 50
  }
  
  export function validateRegion(region: string): boolean {
    return region.length >= 2 && region.length <= 100
  }
  
  export function validateIntroduction(introduction: string): boolean {
    return introduction.length <= 500
  }