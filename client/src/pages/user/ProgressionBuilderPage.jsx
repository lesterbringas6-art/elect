import ProgressionBuilder from '../../components/ProgressionBuilder';

const ProgressionBuilderPage = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Chord Learning Path</h1>
      <p className="text-muted-foreground text-sm mt-1">Progress from basic open chords to barre chords</p>
    </div>
    <ProgressionBuilder />
  </div>
);

export default ProgressionBuilderPage;
