public class DiaryService
{
    private readonly DiaryRepository _diaryRepository;

    public DiaryService(DiaryRepository diaryRepository)
    {
        _diaryRepository = diaryRepository;
    }

    public async Task<List<Diary>> GetDiaries() => await _diaryRepository.GetAllDiaries();

    public async Task AddDiary(Diary diary)
    {
        await _diaryRepository.AddDiary(diary);
    }
}
