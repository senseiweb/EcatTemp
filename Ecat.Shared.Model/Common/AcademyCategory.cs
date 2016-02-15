namespace Ecat.Shared.Model
{
    public class AcademyCategory
    {
        public string Id { get; set; }
        public string BbCatId { get; set; }
        public string BbCatName { get; set; }
        public int RelatedCoursesCount { get; set; }
    }
}