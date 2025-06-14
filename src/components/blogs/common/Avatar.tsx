export default function Avatar({ name }: { name: string }) {
  const initials = name.charAt(0)
  return <div className="flex items-center gap-3 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full justify-center text-lg font-bold">{initials}</div>;
}
