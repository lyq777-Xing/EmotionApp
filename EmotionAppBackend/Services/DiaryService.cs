public class DiaryService
{
    private readonly DiaryRepository _diaryRepository;

    public DiaryService(DiaryRepository diaryRepository)
    {
        _diaryRepository = diaryRepository;
    }

    /**
     * 获取所有日记
     */
    public async Task<List<Diary>> GetDiaries() => await _diaryRepository.GetAllDiaries();

    /**
     * 添加日记
     */
    public async Task AddDiary(Diary diary)
    {
        await _diaryRepository.AddDiary(diary);
    }

    /**
     * 根据用户ID获取日记列表
     */
    public async Task<List<DiaryDto>> GetDiariesByUserId(int userId) =>
        await _diaryRepository.GetDiariesByUserId(userId);

    /**
     * 根据日记ID获取日记
     */
    public async Task<DiaryDto> GetDiaryById(int diaryId) =>
        await _diaryRepository.GetDiaryById(diaryId);
}
