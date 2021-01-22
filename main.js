const VkBot = require('node-vk-bot-api'); // Основа
const api = require('node-vk-bot-api/lib/api'); // Библиотека для получения имени в ВК
const Markup = require('node-vk-bot-api/lib/markup'); // Библиотека для клавиатуры
const token = process.env.TOKEN // Токен группы
const bot = new VkBot(token); // Авторизация в вк
const mongoose = require("mongoose"); // Модуль mongoose
const Schema = mongoose.Schema; // Создание схемы
// Подключение к mongoose
mongoose.connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

// Клавиатура
const MainKeyBoard = Markup.keyboard([[Markup.button('Деревня', 'primary'),],[Markup.button('Лагерь', 'primary'),Markup.button('Магазин', 'primary'),],]),

// установка схем
// Схема пользователя
const userScheme = new Schema({
    VK_ID: Number, // ВК ID пользователя
    ID: Number, // ID пользователя
    Name: String, // Им пользователя
    Gold: Number, // Голда
    Gems: Number, // Кристаллов
    TownHall: Number, // Уровень деревни
    Repository: Number, // Уровень хранилища
    Guardian: Number, // Стражи
    GuardianHealth: Number, // Хп стражей
    GuardinLevel: Number, // Уровень стражей
    Camp: Number, // Тренировочный лагерь
    CampCount: Number, // Кол-во людей
    WhoCamping: String, // Кто тренируется
    Laboratory: Number, // Уровень лаборатории
    Vikings: Number, // Кол-во викингов
    VikingLevel: Number, // Уровень викингов
    Goblins: Number, // Кол-во гоблинов
    GoblinLevel: Number, // Уровень гоблина
    Gigants: Number, // Кол-во гигантов
    GigantLevel: Number, // Уровень гигантов
    Dragons: Number, // Кол-во драконов
    DragonLevel: Number, // Уровень драконов
    Pekka: Number, // Кол-во пек
    PekkaLevel: Number, // Уровень пеки
    Cannons: Number, // Кол-во пушек
    CannonsLevel: Number, // Уровень пушки
    Tower: Number, // Кол-во башень
    TowerLevel: Number, // Уровень башни
    KingGoblin: Number, // Есть ли король гоблинов
    KingGoblinHealth: Number, // Кол-во его хп
    TheKeeper: Number, // Есть ли хранитель
    War: Number, // На кого напали
    ADMIN: Number, // Админ ли?
    VIP: Number, // VIP статус
}); 
const User = mongoose.model("users", userScheme); // сама коллекция с пользователями

// Регистрация пользователя
async function RegisterPlayer(ID)
{
    const data = await api('users.get', {user_ids: ID,access_token: token}); // Получение имени через модуль
    let CountPlayers = 0;
    for(const user of await User.find().exec())
    {
        CountPlayers++;
    }
    await User.create({VK_ID: ID, 
        ID: 1000+CountPlayers, 
        Name: data.response[0].first_name, 
        Gold: 100, 
        Gems: 0, 
        TownHall: 1, 
        Repository: 1, 
        Guardian: 5, 
        GuardianHealth: 20, 
        GuardinLevel: 1, 
        Camp: 0, 
        CampCount: 0, 
        WhoCamping: "0", 
        Laboratory: 0,
        Vikings: 0, 
        VikingLevel: 0, 
        Goblins: 0, 
        GoblinLevel: 0, 
        Gigants: 0, 
        GigantLevel: 0, 
        Dragons: 0, 
        DragonLevel: 0,
        Pekka: 0, 
        PekkaLevel: 0, 
        Cannons: 1, 
        CannonsLevel: 1,
        Tower: 0,
        TowerLevel: 0, 
        KingGoblin: 0,
        KingGoblinHealth: 0,
        TheKeeper: 0,
        War: 0,
        ADMIN: 0,
        VIP: 0}); // Функция создания записи в базе данных
}
// Функция бота: Команда - <Деревня>, lower = True
bot.command('деревня', async (ctx) => {

    // Клавиатура для бота
    let TrueKeyBoard = null;
    if (ctx.message.from_id == ctx.message.peer_id) TrueKeyBoard = MainKeyBoard;

    if (!await User.findOne({VK_ID: ctx.message.from_id}).exec()) // Проверка регистрации
    {
        if (ctx.message.from_id == ctx.message.peer_id) // Проверка на ввод сообщение на прямую боту
            await RegisterPlayer(ctx.message.from_id); // Регистрация пользователя
        else return true;
    }
    const user = await User.findOne({VK_ID: ctx.message.from_id}).exec(); // Поиск пользователя и запись в переменную
    let messageKings = "";
    if(user.KingGoblin)
        messageKings += `🧝 Король гоблинов: ${user.KingGoblin} уровень.\n- Здоровье короля: ${user.KingGoblinHealth}/${user.KingGoblin*50}`;
    if(user.TheKeeper)
        messageKings += `🧙 Хранитель злата: ${user.TheKeeper} уровень\n- Хранитель злата сохраняет ${user.TheKeeper*2}% от воровонного злата`;
    await ctx.reply(`⛪ ${user.Name}, ваша деревня:\n\n\
    🕍 Главное здание: ${user.TownHall} уровень.\n\
    💰 Состояние хранилища: ${user.Gold} золота.\n\
    - Уровень хранилища ${user.Repository}\n\n\
    💂 Стражей деревни: ${user.Guardian} людей.\n\
    ♥ Здоровье стражей: ${user.GuardianHealth}/${user.TownHall*20} HP\n\
    🛡 Пушки: ${user.Cannons}/${user.TownHall*2} | Уровень: ${user.CannonsLevel}
    🏹 Башня с лучниками: ${user.Tower}/${user.TownHall*3} | Уровень: ${user.TowerLevel}\n\
    ${messageKings}`, null, TrueKeyBoard);
});
// Отслеживание всех сообщений
bot.event('message_new', async (ctx) => {
    if (!await User.findOne({VK_ID: ctx.message.from_id}).exec()) // Проверка регистрации
        if(ctx.message.from_id == ctx.message.peer_id)
            await RegisterPlayer(ctx.message.from_id); // Регистрация пользователя
});
// Функция бота: запуск бота
bot.startPolling(); 
