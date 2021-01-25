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
const MainKeyBoard = Markup.keyboard([[Markup.button('Деревня ⛪', 'primary'),],[Markup.button('Лагерь 🎪', 'primary'),Markup.button('Лаборатория 💈', 'primary'),],[Markup.button('Магазин 🏹', 'positive'),],[Markup.button('Атаковать ⚔', 'negative'),],])

// установка схем
// Схема пользователя
const userScheme = new Schema({
    VK_ID: Number, // ВК ID пользователя
    ID: Number, // ID пользователя
    Name: String, // Им пользователя
    Gold: Number, // Голда
    Gems: Number, // Кристаллов
    TownHall: Number, // Уровень деревни
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
    Finder: Number, // Кого нашел
    Attack: Number, // Нападение
    Guard: Number, // защищается
    War: Number, // Идет ли война
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
        Guardian: 5, 
        GuardianHealth: 20, 
        GuardinLevel: 1, 
        Camp: 1, 
        CampCount: 0,  
        Laboratory: 1,
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
        Tower: 1,
        TowerLevel: 1, 
        KingGoblin: 0,
        KingGoblinHealth: 0,
        TheKeeper: 0,
        Finder: 0, 
        Attack: 0,
        Guard: 0,
        War: 0}); // Функция создания записи в базе данных
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
    💰 Состояние хранилища: ${user.Gold} золота.\n\n\
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
    if(user.Vikings + user.Goblins + user.Dragons + user.Pekka == 0)
        messageCamp = "В тренировочном лагере пусто..\nДля тренировки ваших бойцов\n- Тренировать <кого тренировать> <кол-во>";
    
    if(user.Vikings > 0)
        messageCamp += `🦸‍♂️ Викинги: ${user.Vikings} [${user.VikingLevel}]\n`;

    if(user.Goblins > 0)
        messageCamp += `🧟‍♂️ Гоблинов: ${user.Goblins} [${user.GoblinLevel}]\n`;

    if(user.Gigants > 0)
        messageCamp += `👹 Гигантов: ${user.Gigants} [${user.GigantLevel}]\n`;

    if(user.Dragons > 0)
        messageCamp += `👿 Драконов: ${user.Dragons} [${user.DragonLevel}]\n`;

    if(user.Pekka > 0)
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
// Функция бота: Команда - <Лаборатория>, lower = True
bot.command('лаборатория', async (ctx) => {

    // Клавиатура для бота
    let TrueKeyBoard = null;
    if (ctx.message.from_id == ctx.message.peer_id) TrueKeyBoard = MainKeyBoard;

    if (!await User.findOne({VK_ID: ctx.message.from_id}).exec()) // Проверка регистрации
    {
        if (ctx.message.from_id == ctx.message.peer_id) // Проверка на ввод сообщение на прямую боту
            await RegisterPlayer(ctx.message.from_id); // Регистрация пользователя
        else return true;
    }
    let messageLaboratory = '⚔ Доступны к прокачке:\n';
    const user = await User.findOne({VK_ID: ctx.message.from_id}).exec(); // Поиск пользователя и запись в переменную
    if(user.VikingLevel != user.Laboratory + 1)
        messageLaboratory += `🦸‍♂️ Викинг: доступно к улучшению\n- Стоимость улучшения: ${user.VikingLevel*100} злата\n`;
    
    if(user.GoblinLevel != user.Laboratory + 1 && user.Laboratory >= 2)
        messageLaboratory += `🧟‍♂️ Гоблин: доступно к улучшению\n- Стоимость улучшения: ${user.GoblinLevel*200} злата\n`;

    if(user.GigantLevel != user.Laboratory + 1 && user.Laboratory >= 3)
        messageLaboratory += `👹 Гигант: доступно к улучшению\n- Стоимость улучшения: ${user.GigantLevel*300} злата\n`;

    if(user.DragonLevel != user.Laboratory + 1 && user.Laboratory >= 4)
        messageLaboratory += `👿 Дракон: доступно к улучшению\n- Стоимость улучшения: ${user.DragonLevel*400} злата\n`;

    if(user.PekkaLevel != user.Laboratory + 1 && user.Laboratory >= 5)
        messageLaboratory += `🤖 Пекка: доступно к улучшению\n- Стоимость улучшения: ${user.PekkaLevel*500} злата\n`;

    await ctx.reply(` 💈 ${user.Name}, ваша лаборатория:\n\
    💉 Уровень лаборатории: ${user.Laboratory}\n\n\
    ${messageLaboratory}\n\n\
    - Для улучшения бойцов:\n\
    Улучшить <название бойца>`, null, TrueKeyBoard);
});
// Функция бота: Команда - <Улучшить>, lower = True
bot.command('улучшить', async (ctx) => {

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
    if(!args[1])
        return await ctx.reply(` 🏹 Используйте: Улучшить <что улучшить>\n`, null, TrueKeyBoard);

    if(args[1].toLowerCase() == 'викинг')
    {
        if(user.Gold < user.VikingLevel*100)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        if(user.VikingLevel == user.Laboratory + 1)
            return await ctx.reply(' 🏹 У вас уже прокачен данный персонаж на максимально возможный уровень', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.VikingLevel*100, VikingLevel: user.VikingLevel + 1 }).exec();
        return await ctx.reply(` 🦸‍♂️ Улучшение викинга завершено\nСтоимость: ${user.VikingLevel*100} злата\nУровень викинга: ${user.VikingLevel+1}`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'гоблин')
    {
        if(user.Gold < user.GoblinLevel*200)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        if(user.Laboratory < 2)
            return await ctx.reply(' 🏹 Ваша лаборатория недостаточно улучшена, чтобы прокачать данного персонажа.', null, TrueKeyBoard);

        if(user.GoblinLevel == user.Laboratory + 1)
            return await ctx.reply(' 🏹 У вас уже прокачен данный персонаж на максимально возможный уровень', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.GoblinLevel*200, GoblinLevel: user.GoblinLevel + 1 }).exec();
        return await ctx.reply(` 🧟‍♂️ Улучшение гоблина завершено\nСтоимость: ${user.GoblinLevel*200} злата\nУровень гоблина: ${user.GoblinLevel+1}`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'гигант')
    {
        if(user.Gold < user.GigantLevel*300)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        if(user.Laboratory < 3)
            return await ctx.reply(' 🏹 Ваша лаборатория недостаточно улучшена, чтобы прокачать данного персонажа.', null, TrueKeyBoard);

        if(user.GigantLevel == user.Laboratory + 1)
            return await ctx.reply(' 🏹 У вас уже прокачен данный персонаж на максимально возможный уровень', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.GigantLevel*300, GigantLevel: user.GigantLevel + 1 }).exec();
        return await ctx.reply(` 👹 Улучшение гиганта завершено\nСтоимость: ${user.GigantLevel*300} злата\nУровень гиганта: ${user.GigantLevel+1}`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'дракон')
    {
        if(user.Gold < user.DragonLevel*400)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        if(user.Laboratory < 4)
            return await ctx.reply(' 🏹 Ваша лаборатория недостаточно улучшена, чтобы прокачать данного персонажа.', null, TrueKeyBoard);

        if(user.DragonLevel == user.Laboratory + 1)
            return await ctx.reply(' 🏹 У вас уже прокачен данный персонаж на максимально возможный уровень', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.DragonLevel*400, DragonLevel: user.DragonLevel + 1 }).exec();
        return await ctx.reply(` 👿 Улучшение дракона завершено\nСтоимость: ${user.DragonLevel*400} злата\nУровень дракона: ${user.DragonLevel+1}`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'пекка')
    {
        if(user.Gold < user.PekkaLevel*500)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        if(user.Laboratory < 5)
            return await ctx.reply(' 🏹 Ваша лаборатория недостаточно улучшена, чтобы прокачать данного персонажа.', null, TrueKeyBoard);

        if(user.PekkaLevel == user.Laboratory + 1)
            return await ctx.reply(' 🏹 У вас уже прокачен данный персонаж на максимально возможный уровень', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.PekkaLevel*500, PekkaLevel: user.PekkaLevel + 1 }).exec();
        return await ctx.reply(` 🤖 Улучшение пекка завершено\nСтоимость: ${user.PekkaLevel*500} злата\nУровень пекка: ${user.PekkaLevel+1}`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'ратуша')
    {
        if(user.Gold < user.TownHall*500)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        if(user.TownHall == 5)
            return await ctx.reply(' 🏹 У вас уже максимальный уровень ратуши.', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.TownHall*500, TownHall: user.TownHall + 1 }).exec();
        return await ctx.reply(` 🏹 Улучшение ратуши завершено!\nСтоимость: ${user.TownHall*500} злата\nУровень: ${user.TownHall+1}`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'лагерь')
    {
        if(user.Gold < user.Camp*200)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        if(user.TownHall == user.Camp)
            return await ctx.reply(' 🏹 Для улучшения лагеря нужно иметь ратушу выше уровня!', null, TrueKeyBoard);

        if(user.Camp == 5)
            return await ctx.reply(' 🏹 У вас уже максимальный уровень лагеря.', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.Camp*200, Camp: user.Camp + 1 }).exec();
        return await ctx.reply(` 🏹 Улучшение лагеря завершено!\nСтоимость: ${user.Camp*200} злата\nУровень: ${user.Camp+1}`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'лаборатория')
    {
        if(user.Gold < user.Laboratory*300)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        if(user.TownHall == user.Laboratory)
            return await ctx.reply(' 🏹 Для улучшения лаборатория нужно иметь ратушу выше уровня!', null, TrueKeyBoard);

        if(user.Laboratory == 5)
            return await ctx.reply(' 🏹 У вас уже максимальный уровень лагеря.', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.Laboratory*300, Laboratory: user.Laboratory + 1 }).exec();
        return await ctx.reply(` 🏹 Улучшение лаборатория завершено!\nСтоимость: ${user.Laboratory*300} злата\nУровень: ${user.Laboratory+1}`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'пушка')
    {
        if(user.Gold < user.CannonsLevel*100)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        if(user.TownHall + 1 == user.CannonsLevel)
            return await ctx.reply(' 🏹 Для улучшения пушек нужно иметь ратушу выше уровня!', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.CannonsLevel*100, CannonsLevel: user.CannonsLevel + 1 }).exec();
        return await ctx.reply(` 🏹 Улучшение пушек завершено!\nСтоимость: ${user.CannonsLevel*100} злата\nУровень: ${user.CannonsLevel+1}`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'башня')
    {
        if(user.Gold < user.TowerLevel*100)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        if(user.TownHall + 1 == user.TowerLevel)
            return await ctx.reply(' 🏹 Для улучшения башни нужно иметь ратушу выше уровня!', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.TowerLevel*100, TowerLevel: user.TowerLevel + 1 }).exec();
        return await ctx.reply(` 🏹 Улучшение башни завершено!\nСтоимость: ${user.TowerLevel*100} злата\nУровень: ${user.TowerLevel+1}`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'король')
    {
        if(user.KingGoblin == 0)
            return await ctx.reply(' 🏹 У вас не имеется король гоблинов!', null, TrueKeyBoard);

        if(user.Gold < user.KingGoblin*25)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        if(user.TownHall * 5 == user.KingGoblin)
            return await ctx.reply(' 🏹 Для улучшения короля нужно иметь ратушу выше уровня!', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.KingGoblin*25, KingGoblin: user.KingGoblin + 1 }).exec();
        return await ctx.reply(` 🏹 Улучшение короля завершено!\nСтоимость: ${user.KingGoblin*25} злата\nУровень: ${user.KingGoblin+1}`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'хранитель')
    {
        if(user.TheKeeper == 0)
            return await ctx.reply(' 🏹 У вас не имеется хранителя!', null, TrueKeyBoard);

        if(user.Gold < user.TheKeeper*50)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        if(user.TownHall * 2 == user.TheKeeper)
            return await ctx.reply(' 🏹 Для улучшения хранителя нужно иметь ратушу выше уровня!', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.TheKeeper*50, TheKeeper: user.TheKeeper + 1 }).exec();
        return await ctx.reply(` 🏹 Улучшение хранителя завершено!\nСтоимость: ${user.TheKeeper*50} злата\nУровень: ${user.TheKeeper+1}`, null, TrueKeyBoard);
    }
    else return await ctx.reply(' 🏹 Я тебя не понял.. Что ты хочешь улучшить?', null, TrueKeyBoard);
});
// Функция бота: Команда - <магазин>, lower = True
bot.command('магазин', async (ctx) => {

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
        return await ctx.reply(` 🏹 Ассортимент магазина:\n\n\
        🛡 Пушка - стоимость за пушку ${user.CannonsLevel*10} злата\n\
        🏹 Башня - стоимость за башню ${user.TowerLevel*10} злата\n\n\
        🧝 Король - стоимость короля 50 злата\n\
        🧙 Хранитель - стоиомость хранителя 150 злата\n\n\
        Используйте: Магазин <название> <кол-во>`, null, TrueKeyBoard);
    const ammount = parseInt(args[2]);
    if(args[1].toLowerCase() == 'пушка' || args[1].toLowerCase() == 'пушку')
    {
        if(user.Cannons == user.TownHall * 2)
            return await ctx.reply(' 🏹 Чтобы иметь больше пушек, улучшите ратушу!', null, TrueKeyBoard);

        if(user.Cannons + ammount > user.TownHall * 2)
            return await ctx.reply(' 🏹 Нет места для стольки пушек!', null, TrueKeyBoard);

        if(user.Gold < user.CannonsLevel*10*ammount)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.CannonsLevel*10*ammount, Cannons: user.Cannons + ammount }).exec();
        return await ctx.reply(` 🏹 Вы успешно построили X${ammount} пушек!\nСтоимость: ${user.CannonsLevel*10*ammount} злата.`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'башня' || args[1].toLowerCase() == 'башню')
    {
        if(user.Tower == user.TownHall * 3)
            return await ctx.reply(' 🏹 Чтобы иметь больше пушек, улучшите ратушу!', null, TrueKeyBoard);

        if(user.Tower + ammount > user.TownHall * 3)
            return await ctx.reply(' 🏹 Нет места для стольки пушек!', null, TrueKeyBoard);

        if(user.Gold < user.TowerLevel*10*ammount)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - user.TowerLevel*10*ammount, Tower: user.Tower + ammount }).exec();
        return await ctx.reply(` 🏹 Вы успешно построили X${ammount} башень!\nСтоимость: ${user.TowerLevel*10*ammount} злата.`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'король')
    {
        if(TownHall < 3)
            return await ctx.reply(' 🏹 У вас недостаточный уровень ратуши!', null, TrueKeyBoard);

        if(user.KingGoblin > 0)
            return await ctx.reply(' 🏹 У вас уже имеется король гоблинов!', null, TrueKeyBoard);

        if(user.Gold < 50)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - 50, KingGoblin: 1 }).exec();
        return await ctx.reply(` 🏹 Вы успешно наняли короля гоблинов!\nСтоимость: 50 злата.`, null, TrueKeyBoard);
    }
    else if(args[1].toLowerCase() == 'хранитель')
    {
        if(TownHall < 5)
            return await ctx.reply(' 🏹 У вас недостаточный уровень ратуши!', null, TrueKeyBoard);

        if(user.TheKeeper > 0)
            return await ctx.reply(' 🏹 У вас уже имеется Хранитель!', null, TrueKeyBoard);

        if(user.Gold < 150)
            return await ctx.reply(' 🏹 Недостаточно средств!', null, TrueKeyBoard);

        await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Gold: user.Gold - 150, TheKeeper: 1 }).exec();
        return await ctx.reply(` 🏹 Вы успешно наняли хранителя!\nСтоимость: 150 злата.`, null, TrueKeyBoard);
    }
    else return await ctx.reply(' 🏹 Я тебя не понял!', null, TrueKeyBoard);
});
// Функция бота: Команда - <Атаковать>, lower = True
bot.command('атаковать', async (ctx) => {

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
    if(user.War != 0)
        return await ctx.reply(` 🏹 Вы уже находитесь в бою/обороне...`, null, TrueKeyBoard);

    await ctx.reply(` 🏹 Идёт поиск опонента...`, null, TrueKeyBoard);
    let CountPlayers = 0;
    for(const user of await User.find().exec())
    {
        CountPlayers++;
    }
    const random = getRandomInt(CountPlayers);
    if(!await await User.findOne({ID: 1000+random}).exec())
        return await ctx.reply(` 🏹 Произошла ошибка при поиске врага!\nПовторите попытку еще раз!`, null, TrueKeyBoard);
    
    const enemy = await User.findOne({ID: 1000+random}).exec(); // Поиск пользователя и запись в переменную
    await User.findOneAndUpdate({VK_ID: ctx.message.from_id},{ Finder: enemy.VK_ID }).exec();
    await ctx.reply(` 🏹 ВРАГ НАЙДЕН!\n\n\
    На кого нападаите: [${enemy.VK_ID}|${enemy.Name}]\n\
    🕍 Ратуша: ${enemy.TownHall} уровень\n\
    🛡 Пушек: ${enemy.Cannons} шт.\n\
    🏹 Башни: ${enemy.Tower} шт.\n\n\
    При победе вы получите:
    🏆 Кубков +30\n\
    💰 Золота: ${enemy.Gold- enemy.Gold/40*100}\n\n\
    Для выбора другого опонента, введите: Далее\n\
    Прекратить поиск: Отмена`, null, TrueKeyBoard);
});
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
// Отслеживание всех сообщений
bot.event('message_new', async (ctx) => {
    if (!await User.findOne({VK_ID: ctx.message.from_id}).exec()) // Проверка регистрации
        if(ctx.message.from_id == ctx.message.peer_id)
            await RegisterPlayer(ctx.message.from_id); // Регистрация пользователя
});
// Функция бота: запуск бота
bot.startPolling(); 
