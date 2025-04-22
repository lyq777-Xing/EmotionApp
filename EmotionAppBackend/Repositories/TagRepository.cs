//using EmotionAppBackend.Models;
//using Microsoft.EntityFrameworkCore;

//public class TagRepository
//{
//    private readonly EmotionAppContext _context;

//    public TagRepository(EmotionAppContext context)
//    {
//        _context = context;
//    }

//    public async Task<Tag> AddTag(Tag t)
//    {
//        var result = await _context.Tags.AddAsync(t);
//        await _context.SaveChangesAsync();
//        return result.Entity;
//    }
//}
