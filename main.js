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
const MainKeyBoard = Markup.keyboard([[Markup.button('Деревня ⛪', 'primary'),],[Markup.button('Лагерь 🎪', 'primary'),Markup.button('Магазин', 'primary'),],]),

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
        Laboratory: 0,
        Vikings: 0, 
        VikingLevel: 1, 
        Goblins: 0, 
        GoblinLevel: 1, 
        Gigants: 0, 
        GigantLevel: 1, 
        Dragons: 0, 
        DragonLevel: 1,
        Pekka: 0, 
        PekkaLevel: 1, 
        Cannons: 1, 
        CannonsLevel: 1,
        Tower: 0,
        TowerLevel: 0, 
        KingGoblin: 0,
        KingGoblinHealth: 0,
        TheKeeper: 0,
        War: 0,
        ADMIN: 0,
        VIP: 0,
        TimeCamping}); // Функция создания записи в базе данных
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
    await ctx.reply(` ⛪ ${user.Name}, ваша деревня:\n\n\
    📌 Персональный ID: ${user.ID}\n\
    🕍 Главное здание: ${user.TownHall} уровень.\n\
    💰 Состояние хранилища: ${user.Gold} золота.\n\
    - Уровень хранилища ${user.Repository}\n\n\
    💂 Стражей деревни: ${user.Guardian} людей.\n\
    ♥ Здоровье стражей: ${user.GuardianHealth}/${user.TownHall*20} HP\n\
    🛡 Пушки: ${user.Cannons}/${user.TownHall*2} | Уровень: ${user.CannonsLevel}
    🏹 Башня с лучниками: ${user.Tower}/${user.TownHall*3} | Уровень: ${user.TowerLevel}\n\
    ${messageKings}`, null, TrueKeyBoard);
});
// Функция бота: Команда - <Лагерь>, lower = True
bot.command('лагерь', async (ctx) => {

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
    let messageCamp = "⚔ Бойцы:\n";
    if(Vikings + Goblins + Dragons + Pekka == 0)
        messageCamp = "В тренировочном лагере пусто..\nДля тренировки ваших бойцов: Тренировать <кого тренировать> <кол-во>";
    
    if(Vikings > 0)
        messageCamp += `🦸‍♂️ Викинги: ${user.Vikings} [${user.VikingLevel}]\n`;

    if(Goblins > 0)
        messageCamp += `🧟‍♂️ Гоблинов: ${user.Goblins} [${user.GoblinLevel}]\n`;

    if(Gigants > 0)
        messageCamp += `👹 Гигантов: ${user.Gigants} [${user.GigantLevel}]\n`;

    if(Dragons > 0)
        messageCamp += `👿 Драконов: ${user.Dragons} [${user.DragonLevel}]\n`;

    if(Pekka > 0)
        messageCamp += `🤖 Пекк: ${user.Pekka} [${user.PekkaLevel}]\n`;
    await ctx.reply(` 🎪 ${user.Name}, тренировочный лагерь:\n\n\
    ⛺ Вместительность: ${user.CampCount}/${user.Camp*15} | Уровень ${user.Camp}\n\n${messageCamp}`, null, TrueKeyBoard);
});
// Функция бота: Команда - <Тренировать>, lower = True
bot.command('тренировать', async (ctx) => {

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
    const args = ctx.message.text.split(' ');
    if(!args[1] || !args[2])
        return await ctx.reply(` 🏹 Используйте: Тренировать <название бойца> <кол-во>\n\
                                Тренировки бойцов требует трат злата!\n\n\
                                🦸‍♂️ Викинг = ${user.VikingLevel*2} злата\n\
                                🧟‍♂️ Гоблин = ${user.GoblinLevel*4} злата\n\
                                👹 Гигант = ${user.GigantLevel*6} злата\n\
                                👿 Дракон = ${user.DragonLevel*8} злата\n\
                                🤖 Пекка = ${user.PekkaLevel*10} злата\n`, null, TrueKeyBoard);
    const ammount = parseInt(args[2]);
    if(ammount + user.CampCount > user.Camp*15)
        return await ctx.reply(' 🏹 Для такого количества бойцов нет места!', null, TrueKeyBoard);

    if(args[1].toLowerCase() == 'викинг')
    {
        if(user.Gold < user.VikingLevel*2*ammount)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.VikingLevel*2*ammount, Vikings: user.Vikings + ammount, CampCount: user.CampCount + ammount }).exec();
        return await ctx.reply(` 🦸‍♂️ Тренировка викингов закончена!\nВыпущено бойцов ${ammount}.`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'гоблин')
    {
        if(user.Camp < 2)
            return await ctx.reply(' 🏹 Тренировочный лагерь недостаточно улучшен..\nГоблинов можно тренировать только со 2 уровня лагеря', null, TrueKeyBoard);
        
        if(user.Gold < user.GoblinLevel*4*ammount)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.GoblinLevel*4*ammount, Goblins: user.Goblins + ammount, CampCount: user.CampCount + ammount }).exec();
        return await ctx.reply(` 🧟‍♂️ Тренировка гоблинов закончена!\nВыпущено бойцов ${ammount}.`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'гигант')
    {
        if(user.Camp < 3)
            return await ctx.reply(' 🏹 Тренировочный лагерь недостаточно улучшен..\nГигантов можно тренировать только со 3 уровня лагеря', null, TrueKeyBoard);
        
        if(user.Gold < user.GigantLevel*6*ammount)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.GigantLevel*6*ammount, Gigants: user.Gigants + ammount, CampCount: user.CampCount + ammount }).exec();
        return await ctx.reply(` 👹 Тренировка гигантов закончена!\nВыпущено бойцов ${ammount}.`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'дракон')
    {
        if(user.Camp < 4)
            return await ctx.reply(' 🏹 Тренировочный лагерь недостаточно улучшен..\nДраконов можно тренировать только со 4 уровня лагеря', null, TrueKeyBoard);
        
        if(user.Gold < user.DragonLevel*8*ammount)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.DragonLevel*8*ammount, Dragons: user.Dragons + ammount, CampCount: user.CampCount + ammount }).exec();
        return await ctx.reply(` 👿 Тренировка драконов закончена!\nВыпущено бойцов ${ammount}.`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'пекка')
    {
        if(user.Camp < 5)
            return await ctx.reply(' 🏹 Тренировочный лагерь недостаточно улучшен..\nПекку можно тренировать только со 5 уровня лагеря', null, TrueKeyBoard);
        
        if(user.Gold < user.PekkaLevel*10*ammount)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.PekkaLevel*10*ammount, Pekka: user.Pekka + ammount, CampCount: user.CampCount + ammount }).exec();
        return await ctx.reply(` 🤖 Тренировка пекк закончена!\nВыпущено бойцов ${ammount}.`, null, TrueKeyBoard);
    }
    else return await ctx.reply(' 🏹 Такого персонажа не существует!', null, TrueKeyBoard);
});
// Отслеживание всех сообщений
bot.event('message_new', async (ctx) => {
    if (!await User.findOne({VK_ID: ctx.message.from_id}).exec()) // Проверка регистрации
        if(ctx.message.from_id == ctx.message.peer_id)
            await RegisterPlayer(ctx.message.from_id); // Регистрация пользователя
});
// Функция бота: запуск бота
bot.startPolling(); 
