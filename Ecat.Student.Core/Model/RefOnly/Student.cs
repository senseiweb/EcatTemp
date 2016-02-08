using Ecat.Shared.Core.Model;

namespace Ecat.Student.Core.Model.RefOnly
{
    public class Student
    {
        public Student() { }

        public Student(Person person)
        {
            Id = person.Id;
            AvatarLocation = person.AvatarLocation;
            FullNameTitle = $"{person.FirstName} {person.LastName}";
            FullNameTitleReverse = $"{person.LastName}, {person.FirstName}";
            GoByName = person.GoByName;
            Bio = person.Student?.Bio;
        }

        public int Id { get; }
        public string AvatarLocation { get;}
        public string FullNameTitle { get; }
        public string FullNameTitleReverse { get; }
        public string GoByName { get;  }
        public string Bio { get; }
    }
}
