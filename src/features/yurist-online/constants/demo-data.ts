import type { Lawyer, LegalRequest } from '../types/models'

export const categories = [
  { name: 'Fuqarolik huquqi', short: 'Fuqarolik', count: 328, icon: 'scale' },
  { name: 'Oila huquqi', short: 'Oila', count: 218, icon: 'heart' },
  { name: 'Jinoyat huquqi', short: 'Jinoyat', count: 142, icon: 'shield' },
  { name: 'Mehnat huquqi', short: 'Mehnat', count: 98, icon: 'briefcase' },
  { name: 'Uy-joy masalalari', short: 'Uy-joy', count: 275, icon: 'house' },
  { name: 'Biznes va soliq', short: 'Biznes', count: 184, icon: 'building' },
  { name: 'Yer masalalari', short: 'Yer', count: 91, icon: 'landmark' },
  { name: 'Boshqa yo‘nalishlar', short: 'Boshqa', count: 56, icon: 'grid' },
] as const

export const lawyers: Lawyer[] = [
  { id: '11', name: 'Shahnoza Rahimova', title: 'Oila va fuqarolik ishlari advokati', category: 'Oila huquqi', experience: 12, rating: 4.95, reviews: 214, price: 180000, online: true, initials: 'SR', avatarColor: '#B86B78', license: '№048291', languages: ['O‘zbek', 'Rus'], service: 'Meros huquqi masalalari' },
  { id: '12', name: 'Boburmirzo Yoqubov', title: 'Biznes, IT va soliq maslahatchisi', category: 'Biznes va soliq', experience: 8, rating: 4.88, reviews: 156, price: 250000, online: false, initials: 'BY', avatarColor: '#477FA4', license: '№051742', languages: ['O‘zbek', 'Rus', 'Ingliz'], service: 'Korporativ audit va startap' },
  { id: '13', name: 'Dilnoza Umarova', title: 'Uy-joy va meros masalalari', category: 'Uy-joy masalalari', experience: 15, rating: 5.0, reviews: 89, price: 150000, online: true, initials: 'DU', avatarColor: '#AB7A3D', license: '№039518', languages: ['O‘zbek', 'Rus'], service: 'Meros huquqi ekspertizasi' },
  { id: '14', name: 'Javohir Xolmatov', title: 'Fuqarolik va mehnat huquqi yuristi', category: 'Fuqarolik huquqi', experience: 9, rating: 4.86, reviews: 72, price: 170000, online: true, initials: 'JX', avatarColor: '#478A83', license: '№046307', languages: ['O‘zbek', 'Rus'], service: 'Mehnat nizolari bo‘yicha yordam' },
  { id: '15', name: 'Nodirbek Karimov', title: 'Uy-joy va fuqarolik huquqi', category: 'Uy-joy masalalari', experience: 8, rating: 4.8, reviews: 76, price: 200000, online: true, initials: 'NK', avatarColor: '#3D6F94', license: '№042916', languages: ['O‘zbek', 'Rus'], service: 'Ko‘chmas mulk shartnomalari' },
]

export const initialRequests: LegalRequest[] = [
  { id: 'MVA-8492', status: 'Kutilayotgan', kind: 'Video konsultatsiya', lawyerId: '15', lawyerName: 'Nodirbek Karimov', lawyerTitle: 'Fuqarolik huquqi advokati', subject: 'Kvartira oldi-sotdisi bo‘yicha garov shartnomasini va xatarlarni baholash', price: 200000, date: 'Bugun, 15:30', duration: '45 daqiqa' },
  { id: 'MEEK-3310', status: 'Ko‘rib chiqilmoqda', kind: 'Hujjat ekspertizasi', lawyerId: '11', lawyerName: 'Shahnoza Rahimova', lawyerTitle: 'Shartnoma va korporativ tahlil eksperti', subject: 'Oldi-sotdi_shartnomasi_v2.pdf', price: 250000, date: 'Bugun 19:00 gacha tayyor bo‘ladi', fileName: 'Oldi-sotdi_shartnomasi_v2.pdf', progress: 65 },
  { id: 'BUS-7192', status: 'Yakunlangan', kind: 'Matnli chat', lawyerId: '12', lawyerName: 'Boburmirzo Yoqubov', lawyerTitle: 'Soliq va korporativ huquq maslahatchisi', subject: 'Huquqiy xulosa va tavsiyanoma tayyorlandi', price: 150000, date: '12-noyabr, 2025', rating: 5 },
]

export const documentTypes = ['Shartnoma tahlili', 'Ko‘chmas mulk oldi-sotdi', 'Da’vo arizasi loyihasi', 'Meros hujjatlari', 'Mehnat nizosi hujjati']
export const consultationTimes = ['10:00', '11:30', '14:00', '15:30', '17:00', '18:30']

export const formatMoney = (value: number) => `${value.toLocaleString('en-US')} so‘m`
